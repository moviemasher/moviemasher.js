<script>
  import { onMount } from "svelte";

  import { mmIcon } from "../mmIcon";

  let ref;

  console.log("First: I have inited!", ref);
  ref.appendChild(mmIcon());

  onMount(() => {
    console.log("Second: I have mounted!", ref);
  });
</script>

<span bind:this={ref} />