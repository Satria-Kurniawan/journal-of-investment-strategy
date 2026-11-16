<script lang="ts">
  let count: number = $state(0)
  const increment = () => {
    count += 1
  }
</script>

<button
  type="button"
  class="mb-6 inline-flex rounded-md border-2 border-transparent bg-brand-subtle px-2.5 py-1.5 font-mono text-base text-brand transition-colors duration-200 hover:border-brand/50"
  onclick={increment}
>
  Count is {count}
</button>
