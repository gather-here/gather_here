import MainDetailServer from "@/components/MainDetail/MainDetailServer";


const MainDetailPage = ({ params }: { params: { id: string } }) => {
  return <MainDetailServer postId={params.id} />;
};

export default MainDetailPage;