
import { Breadcrumb, Layout } from 'antd';
import LoadingPage from '../../../components/loadingPage/Index';
import LoginHeader from '../../../components/loginHeader/Index';
import MenuCollapsible from '../../../components/menu/Index';
import styles from './Kanban.module.css'


const { Header, Content, Footer } = Layout;

function KanbanPage() {
	return (
		<Layout className={ styles.container }>
			<MenuCollapsible selected={ ['sub1', '4'] } />
			<Layout>
				<Header className={ styles.header } >
					<LoginHeader />
				</Header>
				<Content>
					<Breadcrumb className={ styles.breadcrumb }>
						<Breadcrumb.Item>RMP</Breadcrumb.Item>
						<Breadcrumb.Item>Rotinas</Breadcrumb.Item>
						<Breadcrumb.Item>Kanban</Breadcrumb.Item>
					</Breadcrumb>
				</Content>
			</Layout>
		</Layout>

	)
}

KanbanPage.auth = {
	role: 'admin',
	loading: <LoadingPage />,
	unauthorized: "/login",
}

export default KanbanPage