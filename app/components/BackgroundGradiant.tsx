import Image from "next/image";
import gradiants from "@/app/assets/gradiants/backgroundGradiant.svg";
import RippleGrid from "./ui/background/DotGrid";
import DotGrid from "./ui/background/DotGrid";

export default function BackgroundGradiant() {
    return (
        <>
            <Image
                src={gradiants}
                alt="Background gradiant image"
                className="backgroundAnimationTop h-[700px] w-[700px] pointer-events-none select-none"
                priority
            />
            <Image
                src={gradiants}
                alt="Background gradiant image"
                className="backgroundAnimation h-[700px] w-[700px] pointer-events-none select-none"
            />
            <div
                className="
    fixed
    top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2
    h-screen w-full 
    z-10
  "
            >
                <DotGrid
                    dotSize={2}
                    gap={15}
                    baseColor="#d6d6d6"
                    activeColor="#36DBBA"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>

        </>
    );
}
