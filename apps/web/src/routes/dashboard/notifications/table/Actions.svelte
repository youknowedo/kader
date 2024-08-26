<script lang="ts">
	import { Button, DropdownMenu } from '@kader/ui/components';
	import Ellipsis from 'lucide-svelte/icons/ellipsis';

	export let id: string;
</script>

<div class="flex justify-end w-fit">
	<Button>Reject</Button>
	<Button>Accept</Button>
</div>
