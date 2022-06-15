
import {
	DesktopOutlined, HddOutlined, HomeOutlined, ScheduleOutlined, SettingOutlined, UserOutlined, YoutubeOutlined, SnippetsOutlined
} from '@ant-design/icons';
import { Layout, Menu, MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './Menu.module.css'
import useMenu from './useMenu';

const { Sider } = Layout;
const { SubMenu } = Menu;

type MenuItem = Required<MenuProps>['items'][number];


function MenuAdmin(props: { selected: string[] }) {

	const router = useRouter()

	const context = useMenu();

	function getItem(
		label: React.ReactNode,
		key: React.Key,
		path?: string,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: 'group',
	): MenuItem {
		return {
			key,
			icon,
			children,
			label,
			type,
			onClick: (e) => {
				if (path) {
					router.push(path)
				}
			},
		} as MenuItem;
	}

	const items: ItemType[] = [
		getItem('Remoto', 'remote', null, <DesktopOutlined />, [
			getItem(
				'Comando',
				'remote-command',
				'remote/command',
				<DesktopOutlined />,
			),
			getItem(
				'Remoto',
				'remote-remote',
				'remote/remote',
				<DesktopOutlined />
			),
			getItem(
				'Status',
				'remote-status',
				'remote/status',
				<HddOutlined />),
		]),
		getItem('Financeiro', 'financial', null, <SnippetsOutlined />, [
			getItem(
				'Overview',
				'financial-Overview',
				'/financial/overview',
				<SnippetsOutlined />),
			getItem(
				'Pagamentos',
				'financial-payments',
				'/financial/payments',
				<SnippetsOutlined />),
		]),
	]

	return (
		<Sider collapsible collapsed={ context.collapsed } onCollapse={ context.toggleCollapsed }>
			<div className={ styles.logo }>Kawori</div>
			<Menu
				theme="dark"
				selectedKeys={ props.selected }
				mode="inline"
				items={ items }
				onClick={ (e) => console.log(e) }
			>
				<Menu.Item key="1" icon={ <HomeOutlined /> }>
					<Link href={ '/' }>
						Inicio
					</Link>
				</Menu.Item>
				{ context.status === 'authenticated' && (
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

export default MenuAdmin
