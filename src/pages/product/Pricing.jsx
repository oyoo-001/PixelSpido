import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Check, X, Zap, Crown, Building2, ArrowRight, HelpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Footer from "@/components/Footer";

const faqs = [
  {
    question: "What's included in the free trial?",
    answer: "The free trial gives you 7 days of Pro features with unlimited projects. No credit card required.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your access continues until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and mobile money through Paystack.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 7-day money-back guarantee. If you're not satisfied, contact support for a full refund.",
  },
  {
    question: "Can I change plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
  },
  {
    question: "Do you offer enterprise pricing?",
    answer: "Yes! For teams larger than 10 users, contact us for custom pricing and dedicated support.",
  },
];

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await api.subscription.getPlans();
        setPlans(data);
      } catch (error) {
        console.error("Failed to load plans:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  const getPrice = (plan) => {
    if (billingCycle === "yearly") {
      const yearly = Math.round(plan.price_ksh * 10 / 12);
      return { amount: yearly, suffix: "/mo (billed yearly)" };
    }
    return { amount: plan.price_ksh, suffix: "/mo" };
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Crown className="h-4 w-4" />
            Simple Pricing
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            Choose Your
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              {" "}Plan
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when you're ready. All plans include our core AI features.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 bg-card rounded-full border border-border">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "monthly" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === "yearly" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly <span className="text-xs opacity-70 ml-1">-17%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => {
              const price = getPrice(plan);
              return (
                <div 
                  key={i}
                  className={`relative p-8 rounded-3xl ${
                    plan.popular 
                      ? "bg-gradient-to-br from-primary/20 to-purple-500/20 border-2 border-primary shadow-lg shadow-primary/20" 
                      : "bg-card border border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-purple-500 rounded-full text-sm font-medium text-white">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {price.amount === 0 ? "Free" : `KES ${price.amount.toLocaleString()}`}
                    </span>
                    <span className="text-muted-foreground">{price.amount === 0 ? "" : price.suffix}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={price.amount === 0 ? "/login" : "/login?redirect=/dashboard/pricing"}>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? "bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90" 
                          : ""
                      }`}
                    >
                      {price.amount === 0 ? "Start Free Trial" : "Subscribe"} <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Money Back */}
      <section className="py-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Got questions? We've got answers.</p>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="rounded-xl bg-card border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium">{faq.question}</span>
                  <HelpCircle className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-card border border-border">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">Can't find what you're looking for? We're here to help.</p>
            <Link to="/contact">
              <Button variant="outline">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}