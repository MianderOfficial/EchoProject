import React from 'react';
import { SlideData } from '../types/presentation';
import { TitleSlide } from './slides/TitleSlide';
import { AgendaSlide } from './slides/AgendaSlide';
import { TeamSlide } from './slides/TeamSlide';
import { SmartGoalSlide } from './slides/SmartGoalSlide';
import { AudienceSlide } from './slides/AudienceSlide';
import { AnalogsSlide } from './slides/AnalogsSlide';
import { IdeaCollageSlide } from './slides/IdeaCollageSlide';
import { IdeaFeaturesSlide } from './slides/IdeaFeaturesSlide';
import { IdeaWorkflowSlide } from './slides/IdeaWorkflowSlide';
import { SocialImpactSlide } from './slides/SocialImpactSlide';
import { RoadmapSlide } from './slides/RoadmapSlide';
import { FinalSlide } from './slides/FinalSlide';
import { SoundWaveCanvas } from './SoundWaveCanvas';

interface SlideRendererProps {
  slide: SlideData;
  onUpdateSlide: (updated: SlideData) => void;
  onNavigateToSlide?: (slideId: string) => void;
  theme?: string;
  showWaveBackground?: boolean;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  onUpdateSlide,
  onNavigateToSlide,
  theme = 'dark-sonic',
  showWaveBackground = true,
}) => {
  const renderSlideContent = () => {
    switch (slide.type) {
      case 'title':
        return <TitleSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'agenda':
        return (
          <AgendaSlide
            slide={slide}
            onUpdate={onUpdateSlide}
            onNavigateToSlide={onNavigateToSlide}
            theme={theme}
          />
        );
      case 'team':
        return <TeamSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'smart-goal':
        return <SmartGoalSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'audience':
        return <AudienceSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'analogs':
        return <AnalogsSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'idea-collage':
        return <IdeaCollageSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'idea-features':
        return <IdeaFeaturesSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'idea-workflow':
        return <IdeaWorkflowSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'social-impact':
        return <SocialImpactSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'roadmap':
        return <RoadmapSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      case 'final':
        return <FinalSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
      default:
        return <TitleSlide slide={slide} onUpdate={onUpdateSlide} theme={theme} />;
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Only dispatch if not clicking an input, button or link
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.closest('input')
    ) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    window.dispatchEvent(
      new CustomEvent('echo-pulse', {
        detail: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
      })
    );
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`relative w-full h-full overflow-hidden select-none cursor-default ${
        theme === 'light-acoustic'
          ? 'bg-gradient-to-br from-slate-100 via-sky-50 to-teal-50'
          : 'bg-gradient-to-br from-[#061220] via-[#091A2E] to-[#040C16]'
      }`}
    >
      {/* Background ambient soundwave & echo pulse canvas */}
      {showWaveBackground && (
        <SoundWaveCanvas
          intensity={slide.type === 'title' || slide.type === 'final' ? 'high' : 'medium'}
          theme={theme as any}
          className="opacity-90 z-0"
          enableRipples={true}
          enableParticles={true}
        />
      )}

      {/* Slide foreground */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-auto">
        {renderSlideContent()}
      </div>
    </div>
  );
};
