import Header from "../components/common/Header";
import UserActivityHeatmap from "../components/image/UserActivityHeatmap";
import FileUploadPortal from "../components/image/FileUploadPortal";



const UsersPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
				
					<UserActivityHeatmap />
					<FileUploadPortal/>
					
				</div>
			</main>
		</div>
	);
};
export default UsersPage;
