// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, {
	Html,
	DocumentContext,
	Head,
	Main,
	NextScript,
} from "next/document";
import Script from 'next/script';

import React from "react";

React.useLayoutEffect = React.useEffect;

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head>
					<title>Kawori</title>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;