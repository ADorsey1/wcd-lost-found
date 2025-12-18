import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Trash2, Eye, CheckCircle, XCircle, Package, FileText, Eraser } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Admin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/admin/login');
        return;
      }

      const { data: role } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!role) {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }

      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          navigate('/admin/login');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch items
  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['admin-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('found_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  // Fetch claims
  const { data: claims = [], isLoading: claimsLoading } = useQuery({
    queryKey: ['admin-claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          found_items (name, location)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated,
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('found_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] });
      toast.success("Item deleted successfully");
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error("Failed to delete item");
    },
  });

  // Update item status mutation
  const updateItemStatusMutation = useMutation({
    mutationFn: async ({ itemId, status }: { itemId: string; status: 'available' | 'claimed' | 'pending' }) => {
      const { error } = await supabase
        .from('found_items')
        .update({ status })
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      toast.success("Item status updated");
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error("Failed to update item status");
    },
  });

  // Update claim status mutation
  const updateClaimStatusMutation = useMutation({
    mutationFn: async ({ claimId, status, itemId, claimantName, claimantEmail, itemName }: { 
      claimId: string; 
      status: string; 
      itemId: string;
      claimantName?: string;
      claimantEmail?: string;
      itemName?: string;
    }) => {
      const { error: claimError } = await supabase
        .from('claims')
        .update({ status })
        .eq('id', claimId);
      
      if (claimError) throw claimError;

      // If approved, mark item as claimed and send email
      if (status === 'approved') {
        const { error: itemError } = await supabase
          .from('found_items')
          .update({ status: 'claimed' as const })
          .eq('id', itemId);
        
        if (itemError) throw itemError;

        // Send approval email
        if (claimantName && claimantEmail && itemName) {
          try {
            const { error: emailError } = await supabase.functions.invoke('send-claim-approved', {
              body: { claimantName, claimantEmail, itemName }
            });
            if (emailError) {
              console.error('Email sending failed:', emailError);
            }
          } catch (emailErr) {
            console.error('Failed to send approval email:', emailErr);
          }
        }
      }

      // If rejected, reset item to available
      if (status === 'rejected') {
        const { error: itemError } = await supabase
          .from('found_items')
          .update({ status: 'available' as const })
          .eq('id', itemId);
        
        if (itemError) throw itemError;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] });
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] });
      if (variables.status === 'approved') {
        toast.success("Claim approved and notification sent!");
      } else {
        toast.success("Claim status updated");
      }
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast.error("Failed to update claim");
    },
  });

  // Clear all claims mutation
  const clearClaimsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('claims')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-claims'] });
      toast.success("All claims cleared successfully");
    },
    onError: (error) => {
      console.error('Clear claims error:', error);
      toast.error("Failed to clear claims");
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const statusColors: Record<string, string> = {
    available: "bg-green-500/10 text-green-700 border-green-500/20",
    claimed: "bg-muted text-muted-foreground border-muted",
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-700 border-green-500/20",
    rejected: "bg-red-500/10 text-red-700 border-red-500/20",
  };

  if (isCheckingAuth) {
    return (
      <div className="py-8 md:py-12">
        <div className="container">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
              <p className="text-muted-foreground">Verifying access...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="py-8 md:py-12" role="main" aria-label="Admin Dashboard">
      <div className="container">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-5xl tracking-wide text-foreground mb-2">
              ADMIN DASHBOARD
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage lost and found items and claims
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} aria-label="Logout from admin dashboard">
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            Logout
          </Button>
        </header>

        {/* Stats */}
        <section aria-label="Dashboard statistics" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card role="region" aria-label="Total items count">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center" aria-hidden="true">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold" aria-label={`${items.length} total items`}>{items.length}</p>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card role="region" aria-label="Available items count">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center" aria-hidden="true">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" aria-label={`${items.filter(i => i.status === 'available').length} available items`}>
                    {items.filter(i => i.status === 'available').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card role="region" aria-label="Pending claims count">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center" aria-hidden="true">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" aria-label={`${claims.filter(c => c.status === 'pending').length} pending claims`}>
                    {claims.filter(c => c.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Claims</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card role="region" aria-label="Claimed items count">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center" aria-hidden="true">
                  <XCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold" aria-label={`${items.filter(i => i.status === 'claimed').length} claimed items`}>
                    {items.filter(i => i.status === 'claimed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Claimed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList aria-label="Admin management tabs">
            <TabsTrigger value="items" aria-label={`Items tab, ${items.length} items`}>Items ({items.length})</TabsTrigger>
            <TabsTrigger value="claims" aria-label={`Claims tab, ${claims.length} claims`}>Claims ({claims.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Found Items</CardTitle>
                <CardDescription>
                  Manage all reported found items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {itemsLoading ? (
                  <div className="space-y-4" aria-label="Loading items">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" aria-hidden="true" />
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8" role="status">
                    No items have been reported yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table aria-label="Found items table">
                      <TableHeader>
                        <TableRow>
                          <TableHead scope="col">Item</TableHead>
                          <TableHead scope="col">Location</TableHead>
                          <TableHead scope="col">Date Found</TableHead>
                          <TableHead scope="col">Reporter</TableHead>
                          <TableHead scope="col">Status</TableHead>
                          <TableHead scope="col" className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {item.image_url && (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="h-10 w-10 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.category}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                              {new Date(item.date_found).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{item.reporter_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.reporter_email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[item.status]}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {item.status === 'available' && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => updateItemStatusMutation.mutate({
                                            itemId: item.id,
                                            status: 'claimed'
                                          })}
                                          aria-label={`Mark ${item.name} as claimed`}
                                        >
                                          <CheckCircle className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Mark as claimed</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                                <AlertDialog>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="destructive" size="sm" aria-label={`Delete ${item.name}`}>
                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                          </Button>
                                        </AlertDialogTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delete item</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Item?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete "{item.name}" and all associated claims. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteItemMutation.mutate(item.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Claims</CardTitle>
                  <CardDescription>
                    Review and manage item claims
                  </CardDescription>
                </div>
                {claims.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" aria-label="Clear all claims">
                        <Eraser className="mr-2 h-4 w-4" aria-hidden="true" />
                        Clear All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Claims?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all {claims.length} claims. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => clearClaimsMutation.mutate()}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Clear All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardHeader>
              <CardContent>
                {claimsLoading ? (
                  <div className="space-y-4" aria-label="Loading claims">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" aria-hidden="true" />
                    ))}
                  </div>
                ) : claims.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8" role="status">
                    No claims have been submitted yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table aria-label="Claims table">
                      <TableHeader>
                        <TableRow>
                          <TableHead scope="col">Item</TableHead>
                          <TableHead scope="col">Claimant</TableHead>
                          <TableHead scope="col">Contact</TableHead>
                          <TableHead scope="col">Proof</TableHead>
                          <TableHead scope="col">Status</TableHead>
                          <TableHead scope="col" className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {claims.map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {claim.found_items?.name || 'Unknown Item'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {claim.found_items?.location}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{claim.claimant_name}</p>
                                {claim.student_id && (
                                  <p className="text-xs text-muted-foreground">
                                    ID: {claim.student_id}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{claim.claimant_email}</p>
                                {claim.claimant_phone && (
                                  <p className="text-xs text-muted-foreground">
                                    {claim.claimant_phone}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm max-w-xs truncate" title={claim.description_proof}>
                                {claim.description_proof}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[claim.status]}>
                                {claim.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {claim.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 hover:text-green-700"
                                          onClick={() => updateClaimStatusMutation.mutate({
                                            claimId: claim.id,
                                            status: 'approved',
                                            itemId: claim.item_id,
                                            claimantName: claim.claimant_name,
                                            claimantEmail: claim.claimant_email,
                                            itemName: claim.found_items?.name
                                          })}
                                          aria-label={`Approve claim for ${claim.found_items?.name || 'item'}`}
                                        >
                                          <CheckCircle className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Approve claim</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 hover:text-red-700"
                                          onClick={() => updateClaimStatusMutation.mutate({
                                            claimId: claim.id,
                                            status: 'rejected',
                                            itemId: claim.item_id
                                          })}
                                          aria-label={`Reject claim for ${claim.found_items?.name || 'item'}`}
                                        >
                                          <XCircle className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Reject claim</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
