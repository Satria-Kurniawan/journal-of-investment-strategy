<script lang="ts">
  import { onMount } from 'svelte';
  import type { ResearchBrief } from '../data/landingData';
  import AboutSection from './AboutSection.svelte';
  import FeaturedResearch from './FeaturedResearch.svelte';
  import FinalCTA from './FinalCTA.svelte';
  import Footer from './Footer.svelte';
  import HeroSection from './HeroSection.svelte';
  import IntelligenceCategories from './IntelligenceCategories.svelte';
  import LatestNews from './LatestNews.svelte';
  import MarketSnapshot from './MarketSnapshot.svelte';
  import Navbar from './Navbar.svelte';
  import PlatformPreviewModal from './PlatformPreviewModal.svelte';
  import ResearchBriefModal from './ResearchBriefModal.svelte';
  import WhyJISOO from './WhyJISOO.svelte';

  let activeSection = $state('overview');
  let isScrolled = $state(false);
  let previewOpen = $state(false);
  let activeBrief = $state<ResearchBrief | null>(null);
  let briefTrigger = $state<HTMLButtonElement | null>(null);

  const revealClasses =
    'opacity-0 translate-y-2.5 transition-[opacity,translate] duration-300 ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-none motion-reduce:opacity-100 motion-reduce:translate-none';

  function openBrief(brief: ResearchBrief, trigger: HTMLButtonElement): void {
    briefTrigger = trigger;
    activeBrief = brief;
  }

  function closeBrief(): void {
    activeBrief = null;
    requestAnimationFrame(() => {
      briefTrigger?.focus();
    });
  }

  function reveal(node: HTMLElement) {
    if (typeof IntersectionObserver === 'undefined') {
      node.dataset.visible = 'true';
      return {};
    }

    const rect = node.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.95) {
      node.dataset.visible = 'true';
      return {};
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight) {
            node.dataset.visible = 'true';
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0.01, rootMargin: '60px 0px 60px 0px' }
    );

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 12;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const sectionIds = ['overview', 'markets', 'about', 'insights', 'research', 'news'];
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
    };
  });
</script>

<a
  href="#main-content"
  class="fixed -left-[9999px] top-3 z-100 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-surface focus:left-4"
>
  Skip to content
</a>

<Navbar
  {activeSection}
  {isScrolled}
  onOpenPreview={() => (previewOpen = true)}
/>

<main id="main-content">
  <HeroSection />

  <div class={revealClasses} use:reveal>
    <MarketSnapshot />
  </div>

  <div class={revealClasses} use:reveal>
    <AboutSection />
  </div>

  <div class={revealClasses} use:reveal>
    <IntelligenceCategories />
  </div>

  <div class={revealClasses} use:reveal>
    <FeaturedResearch onOpenBrief={openBrief} />
  </div>

  <div class={revealClasses} use:reveal>
    <LatestNews />
  </div>

  <div class={revealClasses} use:reveal>
    <WhyJISOO />
  </div>

  <div class={revealClasses} use:reveal>
    <FinalCTA onExplore={() => (previewOpen = true)} />
  </div>
</main>

<Footer />

<PlatformPreviewModal open={previewOpen} onClose={() => (previewOpen = false)} />
<ResearchBriefModal brief={activeBrief} onClose={closeBrief} />
