import { Heart, MapPin, Clock } from "lucide-react";
import waterWell1 from "@/assets/project-photos/water-well-1.jpg";
import education1 from "@/assets/project-photos/education-1.jpg";
import healthcare1 from "@/assets/project-photos/healthcare-1.jpg";
import environment1 from "@/assets/project-photos/environment-1.jpg";
import disasterRelief1 from "@/assets/project-photos/disaster-relief-1.jpg";
import energy1 from "@/assets/project-photos/energy-1.jpg";

interface ProjectPhoto {
  id: string;
  src: string;
  projectType: 'education' | 'health' | 'water' | 'environment' | 'disaster' | 'energy';
  location: string;
  district: string;
  recentActivity: string;
  amount?: string;
  isActive: boolean;
}

const mockPhotos: ProjectPhoto[] = [
  {
    id: "1",
    src: waterWell1,
    projectType: "water",
    location: "Anuradhapura",
    district: "North Central",
    recentActivity: "2h ago",
    amount: "LKR 45,000",
    isActive: true
  },
  {
    id: "2",
    src: education1,
    projectType: "education", 
    location: "Badulla",
    district: "Uva",
    recentActivity: "1h ago",
    amount: "LKR 125,000",
    isActive: true
  },
  {
    id: "3",
    src: healthcare1,
    projectType: "health",
    location: "Jaffna",
    district: "Northern",
    recentActivity: "30m ago",
    amount: "LKR 78,500",
    isActive: true
  },
  {
    id: "4",
    src: environment1,
    projectType: "environment",
    location: "Kandy",
    district: "Central",
    recentActivity: "45m ago",
    amount: "LKR 32,000",
    isActive: true
  },
  {
    id: "5",
    src: disasterRelief1,
    projectType: "disaster",
    location: "Hambantota",
    district: "Southern",
    recentActivity: "15m ago",
    amount: "LKR 95,000",
    isActive: true
  },
  {
    id: "6",
    src: energy1,
    projectType: "energy",
    location: "Ratnapura",
    district: "Sabaragamuwa",
    recentActivity: "3h ago",
    amount: "LKR 67,500",
    isActive: true
  }
];

const getProjectIcon = (type: ProjectPhoto['projectType']) => {
  switch (type) {
    case 'water': return '💧';
    case 'education': return '📚';
    case 'health': return '🏥';
    case 'environment': return '🌱';
    case 'disaster': return '🤝';
    case 'energy': return '⚡';
    default: return '❤️';
  }
};

const PhotoCard = ({ photo, delay }: { photo: ProjectPhoto; delay: number }) => (
  <div 
    className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 relative group cursor-pointer"
    style={{ 
      animationDelay: `${delay}s`,
      animation: `photoStream 12s linear infinite ${delay}s`
    }}
  >
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg backdrop-blur-sm bg-background/10 border border-white/20 hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20">
      <img 
        src={photo.src} 
        alt={`${photo.projectType} project in ${photo.location}`}
        className="w-full h-full object-cover"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Active Indicator */}
      {photo.isActive && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      )}
      
      {/* Project Type Icon */}
      <div className="absolute top-2 left-2 text-lg opacity-90">
        {getProjectIcon(photo.projectType)}
      </div>
      
      {/* Info Overlay - appears on hover */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 flex flex-col justify-between text-white text-xs">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{photo.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{photo.recentActivity}</span>
          </div>
        </div>
        {photo.amount && (
          <div className="flex items-center gap-1 text-primary-glow">
            <Heart className="w-3 h-3" />
            <span className="font-medium">{photo.amount}</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const HeroPhotoStream = () => {
  // Create multiple rows with different photos and speeds
  const createPhotoRow = (startIndex: number, duration: string, direction: 'normal' | 'reverse' = 'normal') => {
    const rowPhotos = [...mockPhotos, ...mockPhotos, ...mockPhotos]; // Triple for seamless loop
    
    return (
      <div 
        className="flex gap-4 md:gap-6 lg:gap-8 absolute w-max"
        style={{ 
          animation: `photoStream ${duration} linear infinite ${direction}`,
          left: direction === 'normal' ? '-150px' : 'calc(100vw + 150px)'
        }}
      >
        {rowPhotos.map((photo, index) => (
          <PhotoCard 
            key={`${photo.id}-${index}`} 
            photo={photo} 
            delay={index * 0.5} 
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes photoStream {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100vw - 300px));
          }
        }
        
        @keyframes photoStreamReverse {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(100vw + 300px));
          }
        }
      `}</style>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {/* Row 1 - Top */}
        <div className="absolute top-16 md:top-20 lg:top-24 w-full">
          {createPhotoRow(0, '15s')}
        </div>
        
        {/* Row 2 - Upper Middle */}
        <div className="absolute top-32 md:top-40 lg:top-48 w-full">
          {createPhotoRow(2, '18s', 'reverse')}
        </div>
        
        {/* Row 3 - Lower Middle */}
        <div className="absolute top-48 md:top-60 lg:top-72 w-full">
          {createPhotoRow(4, '12s')}
        </div>
        
        {/* Row 4 - Bottom */}
        <div className="absolute top-64 md:top-80 lg:top-96 w-full">
          {createPhotoRow(1, '20s', 'reverse')}
        </div>
        
        {/* Gradient Masks for smooth fade in/out */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background via-background/50 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none" />
      </div>
    </>
  );
};