<script>
  export let onClick;
  export let disabled;
  export let className;
</script>

<button
  on:click={(event) => {
    onClick(event);
  }}
  {disabled}
  class={className}><slot /></button
>