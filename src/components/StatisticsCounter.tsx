import { useEffect, useState, useRef } from "react";
import { Users, DollarSign, Target, Building } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { formatNumber } from "@/utils/numbers";

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
}

const Counter = ({ end, duration = 2000, prefix = "", suffix = "", formatter }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  const displayValue = formatter ? formatter(count) : count.toLocaleString();

  return (
    <div ref={elementRef}>
      {prefix}{displayValue}{suffix}
    </div>
  );
};

const statistics = [
  {
    icon: Users,
    label: "Total Donors",
    value: 52847,
    formatter: (value: number) => formatNumber(value),
    color: "text-blue-600",
  },
  {
    icon: DollarSign,
    label: "Total Donations",
    value: 542000000,
    prefix: "LKR ",
    formatter: (value: number) => formatCurrency(value).replace("LKR ", ""),
    color: "text-green-600",
  },
  {
    icon: Target,
    label: "Active Projects",
    value: 1247,
    formatter: (value: number) => formatNumber(value),
    color: "text-purple-600",
  },
  {
    icon: Building,
    label: "Partner Organizations",
    value: 189,
    formatter: (value: number) => formatNumber(value),
    color: "text-orange-600",
  },
];

export const StatisticsCounter = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Making Impact Across Sri Lanka
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Together, we've built a community of compassion that spans every 
            district of our island nation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  <Counter
                    end={stat.value}
                    prefix={stat.prefix}
                    formatter={stat.formatter}
                  />
                </div>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};