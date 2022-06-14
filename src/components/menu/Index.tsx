
import {
	DesktopOutlined, HddOutlined, HomeOutlined, ScheduleOutlined, SettingOutlined, UserOutlined, YoutubeOutlined, SnippetsOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Menu.module.css'

const { Sider } = Layout;
const { SubMenu } = Menu;



function MenuCollapsible(props: { selected: string[] }) {

	const { status } = useSession()

	const [collapsed, setCollapsed] = useState<boolean>()

	const toggleCollapsed = () => {
		setCollapsed(!collapsed)
	}
	return (
		<Sider collapsible collapsed={ collapsed } onCollapse={ toggleCollapsed }>
			<div className={ styles.logo }>RMP</div>
			<Menu theme="dark" selectedKeys={ props.selected } mode="inline">
				<Menu.Item key="1" icon={ <HomeOutlined /> }>
					<Link href={ '/' }>
						Inicio
					</Link>
				</Menu.Item>
				{ status === 'authenticated' && (
					<>
						<SubMenu key='' icon={ <DesktopOutlined /> } title='Remoto'>
							<Menu.Item key="2" icon={ <DesktopOutlined /> }>
								<Link href={ '/command' }>
									Comando
								</Link>
							</Menu.Item>
							<Menu.Item key="3" icon={ <DesktopOutlined /> }>
								<Link href={ '/remote' }>
									Remoto
								</Link>
							</Menu.Item>
							<Menu.Item key="6" icon={ <HddOutlined /> }>
								<Link href={ '/status' }>
									Status
								</Link>
							</Menu.Item>
						</SubMenu>
						<SubMenu key='sub2' icon={ <SnippetsOutlined /> } title='Financeiro'>
							<Menu.Item key='overview'>
								<Link href={ '/financial/overview' }>
									Overview
								</Link>
							</Menu.Item>
							<Menu.Item key='payments'>
								<Link href={ '/financial/payments' }>
									Pagamentos
								</Link>
							</Menu.Item>
							<Menu.Item key='report'>
								<Link href={ '/financial/report' }>
									Relatorio por mês
								</Link>
							</Menu.Item>
						</SubMenu>
						<SubMenu key="sub1" icon={ <ScheduleOutlined /> } title="Rotinas">
							<Menu.Item key="4">
								<Link href={ '/routines/kanban' }>
									Kanban
								</Link>
							</Menu.Item>
						</SubMenu>
						<Menu.Item key="7" icon={ <SettingOutlined /> }>
							<Link href={ '/server' }>
								Servidor
							</Link>
						</Menu.Item>
					</>
				) }

			</Menu>
		</Sider>
	)
}

export default MenuCollapsible
