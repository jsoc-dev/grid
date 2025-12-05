## Analysis
	- Activity hidden mode only makes root element as display none
	- when tooltip is direct child of Activity then it works fine
	- issue comes when tooltip is wrapped by div then by Activity
## Repro

```ts
function ToolTipIssue() {
	const modes: ActivityProps['mode'][] = ['hidden', 'visible'];
	const [mode, setMode] = useState<ActivityProps['mode']>(modes[0]);
	const show = () => setMode('visible');
	const hide = () => setMode('hidden');

	return (
		<>
			{mode == 'hidden' && <button onClick={show}>Show Text</button>}
			<Activity mode={mode}>
				<div>
					<span>Lorem ipsum dolor sit amet...</span>
					<Tooltip title='Hide'>
						<button onClick={hide}>Hide Text</button>
					</Tooltip>
				</div>
			</Activity>
		</>
	);
}
```

## Workarounds

-   1. Using conditional rendering but then grid state is destroyed.

-   2. Using slotProps.popper.disablePortal = true, but it is getting clipped inside grid cell
		```ts
		slotProps={{
			popper: {disablePortal: true},
		}}
		```

-	3. Closing tooltip manually before setting mode hidden. But tooltip flickers.
		```ts
			const [tooltipOpen, setTooltipOpen] = useState(false);

			<Tooltip 
				title='Hide'
				open={tooltipOpen}
				onOpen={() => setTooltipOpen(true)}
				onClose={() => setTooltipOpen(false)}
			>
				<button onClick={() => {
					setTooltipOpen(false); // still tooltip stays for some millisecs
					window.requestAnimationFrame(hide); 
				}
				}>Hide Text</button>
			</Tooltip>
		```