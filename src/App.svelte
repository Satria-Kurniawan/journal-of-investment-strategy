<script lang="ts">
  import { onMount } from 'svelte';
  import LandingPage from './features/landing/components/LandingPage.svelte';
  import { themeState } from './features/landing/theme/themeState.svelte';

  onMount(() => {
    themeState.init();
  });
</script>

<LandingPage />
