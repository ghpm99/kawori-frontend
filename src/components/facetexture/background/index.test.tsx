import { renderWithProviders } from "@/util/test-utils";
import { screen } from "@testing-library/react";
import Background from "./index";

// Prevent module-level apiAuth.get("/csrf/") from creating unhandled rejections
jest.mock("@/services/auth", () => ({
    refreshTokenAsync: jest.fn(),
    refreshTokenService: jest.fn(),
    signupService: jest.fn(),
}));

// antd-img-crop and antd/lib/upload/Dragger use complex DOM APIs not available in jsdom
jest.mock("antd-img-crop", () => ({ children }: any) => <>{children}</>);
jest.mock("antd/lib/upload/Dragger", () => ({ children }: any) => (
    <div>
        <label aria-label="clique ou arraste o arquivo para esta área para fazer upload">{children}</label>
    </div>
));
jest.mock("@ant-design/icons", () => ({ InboxOutlined: () => null }));
jest.mock("next/image", () => ({
    __esModule: true,
    default: ({ alt, src }: any) => <img alt={alt} src={src} />,
}));
jest.mock("@/util/db", () => ({
    db: {
        background: {
            toArray: jest.fn().mockResolvedValue([{ id: 1, image: new Blob() }]),
            update: jest.fn(),
        },
    },
}));

describe("Background Component", () => {
    test("renders Background component", () => {
        renderWithProviders(<Background theme="light" />);

        expect(screen.getByText("Background")).toBeInTheDocument();
        expect(
            screen.getByText(/clique ou arraste o arquivo para esta área para fazer upload/i),
        ).toBeInTheDocument();
    });
});
