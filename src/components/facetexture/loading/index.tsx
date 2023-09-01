import { Breadcrumb, Layout, message, Skeleton } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import SkeletonImage from 'antd/lib/skeleton/Image'
import LoginHeader from '../../loginHeader/Index'
import MenuAdmin from '../../menuAdmin/Index'
import Styles from './Loading.module.scss'

const Loading = () => {
    return (
        <Layout className={Styles.container}>
            <MenuAdmin selected={['facetexture']} />
            <Layout>
                <Header className={Styles.header}>
                    <LoginHeader />
                </Header>
                <Content>
                    <Breadcrumb className={Styles.breadcrumb}>
                        <Breadcrumb.Item>Kawori</Breadcrumb.Item>
                        <Breadcrumb.Item>Facetexture</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className={Styles['container-toolkit']}>
                        <div className={Styles['characters']}>
                            <div>
                                <h1>Personagens</h1>
                                <SkeletonImage />
                            </div>
                            <div className={Styles['character-info']}>
                                <Skeleton />
                            </div>
                        </div>
                        <div className={Styles['background-container']}>
                            <h1>Background</h1>
                            <div>
                                <SkeletonImage />
                            </div>
                        </div>
                        <div className={Styles['preview-container']}>
                            <h1>Preview</h1>
                            <div>
                                <SkeletonImage />
                            </div>
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default Loading
