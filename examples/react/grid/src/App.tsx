import './App.css';
import { JsocGrid } from '@jsoc/react';
// import user from '../../../api-responses/users.json';
const json = {
	company: {
		name: 'Acme Corp',
		location: 'Springfield',
		departments: [
			{
				name: 'Engineering',
				head: 'Dr. Smith',
				employees: [
					{
						id: 'E001',
						name: 'Alice',
						skills: ['Python', 'Java'],
					},
					{
						id: 'E002',
						name: 'Bob',
						skills: ['C++', 'JavaScript'],
					},
				],
			},
			{
				name: 'Marketing',
				head: 'Ms. Jones',
				employees: [
					{
						id: 'M001',
						name: 'Charlie',
						skills: ['SEO', 'Content Creation'],
					},
				],
			},
		],
	},
	products: [
		{
			id: 'P001',
			name: 'Product A',
			features: {
				color: 'Blue',
				size: 'Medium',
			},
		},
		{
			id: 'P002',
			name: 'Product B',
			features: {
				color: 'Red',
				size: 'Small',
			},
		},
	],
};

function App() {
	return (
		// The JSOC library does not wrap the rendered adapter component inside any DOM element.
		// All intermediate components (Jsoc, JsocView, JsocViewAdapter) are "transparent":
		// they only pass data and context but do NOT render any HTML.
		//
		// This is intentional. It gives the consumer full control over layout and styling,
		// exactly as if they were rendering the adapter component directly.
		//
		// Because of this, it is the consumer’s responsibility to provide the required layout.
		// For example, some adapters (like the MUI DataGrid) require their container to have
		// explicit, non-zero dimensions. If the parent wrapper has no size, the grid may fail
		// to render correctly. See: https://mui.com/x/react-data-grid/layout/
		//
		// Therefore: always wrap <Jsoc> inside an appropriate container when needed.
		// In this example, we give the grid a 500px height and full width.

		<div style={{ height: '500px', width: '100%' }}>
			<JsocGrid data={json} ui='mui' title='Example' />
		</div>
	);
}

export default App;
