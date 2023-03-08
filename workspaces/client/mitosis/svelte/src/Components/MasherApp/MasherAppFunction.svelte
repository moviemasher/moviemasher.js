<script>
  import { getContext } from "svelte";

  import ClientContext from "../../Contexts/ClientContext.context.js";

  export let message;

  let clientContext = getContext(ClientContext.key);

  let name = "Foo";
</script>

<div class="my-class-name">
  {message || "Hello"}
  {name}! !
  <slot />
</div>