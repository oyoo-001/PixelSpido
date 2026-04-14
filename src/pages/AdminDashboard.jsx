import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { showToast, showSuccess } from "@/lib/toast-utils";
import { Loader2, Users, Crown, AlertCircle, DollarSign, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, pricingData] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getPricing(),
      ]);
      setUsers(usersData);
      setPricing(pricingData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePricing = async (plan) => {
    try {
      await api.admin.updatePricing(plan.plan, plan);
      showSuccess("Pricing Updated", `${plan.name} plan has been updated`);
      setEditingPlan(null);
      loadData();
    } catch (error) {
      showToast(error, "Failed to update pricing");
      console.error("Update pricing error:", error);
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "pro":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "business":
        return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-secondary text-muted-foreground border-border";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "expired":
        return "text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, subscriptions, and pricing</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "users" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Users
        </button>
        <button
          onClick={() => setActiveTab("pricing")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "pricing" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <DollarSign className="h-4 w-4 inline mr-2" />
          Pricing
        </button>
      </div>

      {activeTab === "pricing" ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Subscription Plans</h2>
          <div className="grid gap-4">
            {pricing.map((plan) => (
              <div key={plan.plan} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Plan Name</Label>
                      <Input 
                        value={editingPlan?.plan === plan.plan ? editingPlan.name : plan.name} 
                        disabled={plan.plan === 'free'}
                        onChange={(e) => setEditingPlan({ ...plan, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Price (KES)</Label>
                      <Input 
                        type="number"
                        value={editingPlan?.plan === plan.plan ? editingPlan.price_ksh : plan.price_ksh}
                        disabled={plan.plan === 'free'}
                        onChange={(e) => setEditingPlan({ ...plan, price_ksh: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Price (USD)</Label>
                      <Input 
                        type="number"
                        value={editingPlan?.plan === plan.plan ? editingPlan.price_usd : plan.price_usd}
                        disabled={plan.plan === 'free'}
                        onChange={(e) => setEditingPlan({ ...plan, price_usd: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Max Projects/Month</Label>
                      <Input 
                        type="number"
                        value={editingPlan?.plan === plan.plan ? editingPlan.max_projects_per_month : plan.max_projects_per_month}
                        onChange={(e) => setEditingPlan({ ...plan, max_projects_per_month: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  {plan.plan !== 'free' && (
                    <div className="flex gap-2">
                      {editingPlan?.plan === plan.plan ? (
                        <>
                          <Button size="sm" onClick={() => handleSavePricing(editingPlan)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingPlan(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setEditingPlan(plan)}>
                          Edit
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
      <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Crown className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pro Users</p>
              <p className="text-2xl font-bold">{users.filter(u => u.plan === 'pro').length}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Crown className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Business Users</p>
              <p className="text-2xl font-bold">{users.filter(u => u.plan === 'business').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Expires</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPlanColor(user.plan)}`}>
                      {user.plan === 'pro' || user.plan === 'business' ? <Crown className="h-3 w-3 mr-1" /> : null}
                      {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {user.expires_at 
                      ? new Date(user.expires_at).toLocaleDateString() 
                      : `${user.days_remaining} days trial`}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No users found</p>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}