
/* Tab Component */
interface TabProps {
	id: number;
	label: string;
}

const Tab: React.FC<TabProps> = ({ id, label }: TabProps) => {
	console.log(id);

	const outerStyle: React.CSSProperties = {
		backgroundColor: '#333',
		padding: '0.25rem 1rem',
		borderRadius: '0.5rem',
		fontSize: '0.8rem',
	};

	return (
		<div style={outerStyle}>
			<span role="button">{label}</span>
		</div>
	);
};

/* Tabs Container */
export const Tabs: React.FC = () => {
	const outerStyle: React.CSSProperties = {
		height: '48px',
		backgroundColor: 'black',
		borderBottom: '2px solid grey',
	};
	const innerStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		columnGap: '0.5rem',
		height: '100%',
		color: 'white',
		padding: '0 0.5rem',
	};

	return (
		<div style={outerStyle}>
			<div style={innerStyle}>
				<Tab id={1} label={'Tab 1'}/>
				<Tab id={2} label={'Tab 2'}/>
				<Tab id={3} label={'Tab 3'}/>
			</div>
		</div>
	);
};