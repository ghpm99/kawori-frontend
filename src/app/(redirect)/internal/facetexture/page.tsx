"use client";
import { useRouter } from "next/navigation";

const Facetexture = () => {
    const navigate = useRouter();
    navigate.push("/blackdesert/app/facetexture");

    return <div></div>;
};

export default Facetexture;
