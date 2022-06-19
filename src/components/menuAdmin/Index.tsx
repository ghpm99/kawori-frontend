
import {
	DesktopOutlined, HddOutlined, HomeOutlined, SettingOutlined, SnippetsOutlined, UserOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Link from 'next/link';
import styles from './Menu.module.css';
import useMenu from './useMenu';

const { Sider } = Layout;

function MenuAdmin(props: { selected: string[] }) {

	const context = useMenu();

	return (
		<Sider collapsible collapsed={ context.collapsed } onCollapse={ context.toggleCollapsed }>
			<Link href='/'>
				<p className={ styles.logo }>
					Kawori
				</p>
			</Link>
			<Menu
				theme="dark"
				selectedKeys={ props.selected }
				mode="inline"
			>
				<Menu.Item key="1" icon={ <HomeOutlined /> }>
					<Link href={ '/' }>
						Inicio
					</Link>
				</Menu.Item>
				{ context.status === 'authenticated' && (
					<>
						<Menu.Item icon={<UserOutlined />} title='Usuario'>
							<Link href={ '/admin/user' }>
								Conta
							</Link>
						</Menu.Item>
						<Menu.SubMenu key='' icon={ <DesktopOutlined /> } title='Remoto'>
							<Menu.Item key="2" icon={ <DesktopOutlined /> }>
								<Link href={ '/admin/controller/command' }>
									Comando
								</Link>
							</Menu.Item>
							<Menu.Item key="3" icon={ <DesktopOutlined /> }>
								<Link href={ '/admin/controller/remote' }>
									Remoto
								</Link>
							</Menu.Item>
							<Menu.Item key="6" icon={ <HddOutlined /> }>
								<Link href={ '/admin/controller/status' }>
									Status
								</Link>
							</Menu.Item>
						</Menu.SubMenu>
						<Menu.SubMenu key='sub2' icon={ <SnippetsOutlined /> } title='Financeiro'>
							<Menu.Item key='overview'>
								<Link href={ '/admin/financial/overview' }>
									Overview
								</Link>
							</Menu.Item>
							<Menu.Item key='payments'>
								<Link href={ '/admin/financial/payments' }>
									Pagamentos
								</Link>
							</Menu.Item>
							<Menu.Item key='report'>
								<Link href={ '/admin/financial/report' }>
									Relatorio por mês
								</Link>
							</Menu.Item>
						</Menu.SubMenu>
						<Menu.Item key="7" icon={ <SettingOutlined /> }>
							<Link href={ '/admin/server' }>
								Servidor
							</Link>
						</Menu.Item>
					</>
				) }

			</Menu>
		</Sider>
	)
}



export default MenuAdmin
