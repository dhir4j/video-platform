import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Basic',
    price: '$9.99',
    description: 'Access to a library of exclusive content.',
    features: [
      'Ad-free viewing',
      'Access to premium videos',
      'Early access to new releases',
    ],
    cta: 'Choose Basic',
  },
  {
    name: 'Pro',
    price: '$19.99',
    description: 'Everything in Basic, plus more.',
    features: [
      'All Basic features',
      'Download videos for offline viewing',
      'Access to 4K content',
      'Creator Q&A sessions',
    ],
    cta: 'Choose Pro',
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    description: 'For teams and organizations.',
    features: [
      'All Pro features',
      'Multi-user accounts',
      'Dedicated support',
      'Content licensing options',
    ],
    cta: 'Contact Sales',
  },
];

export default function SubscribePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Unlock Exclusive Content
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Choose the plan that's right for you and dive into a world of premium videos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`flex flex-col ${tier.isPopular ? 'border-primary shadow-lg shadow-primary/20' : ''}`}>
            {tier.isPopular && (
              <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-semibold rounded-t-lg">
                Most Popular
              </div>
            )}
            <CardHeader className="pt-6">
              <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                {tier.price !== 'Contact Us' && <span className="text-muted-foreground">/month</span>}
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.isPopular ? 'default' : 'outline'}>
                {tier.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
