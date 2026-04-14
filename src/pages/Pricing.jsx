import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Crown, Zap, Rocket, Star, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PLATFORM_ICONS = {
  starter: Zap,
  pro: Crown,
  business: Rocket,
};

export default function Pricing() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, subData] = await Promise.all([
        api.subscription.getPlans(),
        api.subscription.get(),
      ]);
      setPlans(plansData);
      setSubscription(subData);
    } catch (error) {
      console.error("Failed to load pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (planId === 'starter') {
      toast.info("Free trial is automatically activated on signup");
      return;
    }

    if (subscription?.plan === planId) {
      toast.info("You're already on this plan");
      return;
    }

    setProcessing(planId);
    try {
      const { authorization_url } = await api.subscription.initializePayment({ plan_id: planId });
      window.open(authorization_url, '_blank');
      toast.success("Redirecting to payment...");
    } catch (error) {
      toast.error(error.error || "Failed to initialize payment");
    } finally {
      setProcessing(null);
    }
  };

  const isCurrentPlan = (planId) => subscription?.plan === planId;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Choose the plan that fits your content creation needs
        </p>
        {subscription?.days_remaining !== undefined && subscription.days_remaining > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Star className="h-4 w-4" />
            <span className="text-sm font-medium">{subscription.days_remaining} days left on free trial</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = PLATFORM_ICONS[plan.id] || Zap;
          const isCurrent = isCurrentPlan(plan.id);

          return (
            <div
              key={plan.id}
              className={`relative p-6 rounded-3xl ${
                plan.popular
                  ? 'bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 border-2 border-primary shadow-lg shadow-primary/20'
                  : 'bg-card border border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-purple-500 rounded-full text-xs font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/50 to-purple-500/50 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>

              <div className="mb-4">
                <span className="text-3xl font-bold">KSh {plan.price_ksh.toLocaleString()}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="h-4 w-4 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrent || processing === plan.id}
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90'
                    : ''
                }`}
              >
                {processing === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCurrent ? (
                  'Current Plan'
                ) : plan.price_ksh === 0 ? (
                  'Start Free Trial'
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">How does the free trial work?</h4>
            <p className="text-sm text-muted-foreground">
              New users get 7 days free access to all Pro features. No credit card required.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time. You'll keep access until your billing period ends.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
            <p className="text-sm text-muted-foreground">
              We accept all major credit cards, M-Pesa, and mobile money through Paystack.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Can I upgrade or downgrade?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can change your plan at any time. Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}