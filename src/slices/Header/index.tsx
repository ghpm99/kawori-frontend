import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Header`.
 */
export type HeaderProps = SliceComponentProps<Content.HeaderSlice>;

/**
 * Component for "Header" Slices.
 */
const Header = ({ slice }: HeaderProps): JSX.Element => {
    return (
        <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
            <PrismicRichText field={slice.primary.title} />

            {slice.items.map((item, i) => (
                <div key={i}>
                    <PrismicRichText field={item.description} />
                    {item.illustration && <PrismicNextImage field={item.illustration} />}
                </div>
            ))}
        </section>
    );
};

export default Header;
