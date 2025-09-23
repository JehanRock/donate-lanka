import { useEffect, useState, useRef } from "react";
import { Users, DollarSign, Target, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { formatNumber } from "@/utils/numbers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  isActive?: boolean;
}

const Counter = ({ end, duration = 2000, prefix = "", suffix = "", formatter, isActive }: CounterProps) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) {
      setCount(0);
      return;
    }

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

    // Small delay to make animation more noticeable when slide changes
    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, 200);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      clearTimeout(timeout);
    };
  }, [isActive, end, duration]);

  const displayValue = formatter ? formatter(count) : count.toLocaleString();

  return (
    <div ref={elementRef} className="transition-all duration-300">
      {prefix}{displayValue}{suffix}
    </div>
  );
};

const statistics = [
  {
    icon: Users,
    label: "Active Donors",
    value: 72854,
    formatter: (value: number) => formatNumber(value),
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    description: "Generous hearts supporting change",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: DollarSign,
    label: "Successfully Raised",
    value: 875000000,
    prefix: "LKR ",
    formatter: (value: number) => formatCurrency(value).replace("LKR ", ""),
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    description: "Transforming lives through funding",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Target,
    label: "Projects Completed",
    value: 1847,
    formatter: (value: number) => formatNumber(value),
    color: "from-purple-500 to-violet-500",
    bgColor: "bg-purple-50",
    description: "Dreams turned into reality",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Building,
    label: "Communities Impacted",
    value: 12400,
    suffix: "+",
    formatter: (value: number) => formatNumber(value),
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    description: "Lives touched across Sri Lanka",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
];

export const StatisticsCounter = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % statistics.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % statistics.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + statistics.length) % statistics.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const currentStat = statistics[currentSlide];
  const Icon = currentStat.icon;

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${currentStat.color} transition-all duration-1000 ease-in-out`}
        />
      </div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Making Impact Across Sri Lanka
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Together, we've built a community of compassion that spans every 
            district of our island nation.
          </p>
        </div>

        {/* Slideshow Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Infographic */}
          <div className="relative min-h-[400px] flex items-center justify-center">
            <div 
              className={cn(
                "w-full max-w-2xl mx-auto p-12 rounded-3xl transition-all duration-700 ease-in-out transform",
                "bg-background/80 backdrop-blur-sm border shadow-2xl",
                currentStat.bgColor
              )}
            >
              {/* Icon Section */}
              <div className="text-center mb-8">
                <div className={cn(
                  "inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 transition-all duration-500",
                  currentStat.iconBg
                )}>
                  <Icon className={cn("w-12 h-12", currentStat.iconColor)} />
                </div>
                
                {/* Animated Counter */}
                <div className="text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500"
                     style={{
                       backgroundImage: `linear-gradient(135deg, ${currentStat.color.split(' ')[1].replace('to-', '')}, ${currentStat.color.split(' ')[2]})`
                     }}>
                  <Counter
                    end={currentStat.value}
                    prefix={currentStat.prefix}
                    suffix={currentStat.suffix}
                    formatter={currentStat.formatter}
                    isActive={true}
                    duration={1500}
                  />
                </div>
                
                {/* Label and Description */}
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {currentStat.label}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {currentStat.description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Slide Indicators */}
            <div className="flex gap-3">
              {statistics.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === currentSlide 
                      ? "bg-primary scale-125 shadow-lg" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Auto-play indicator */}
          {isAutoPlaying && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Auto-playing slideshow
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};