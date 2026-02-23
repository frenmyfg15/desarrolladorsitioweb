import Image from "next/image";
import gradiants from "@/app/assets/gradiants/backgroundGradiant.svg";
import DotGrid from "./ui/background/DotGrid";

export default function BackgroundGradiant() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <Image
                src={gradiants}
                alt=""
                aria-hidden="true"
                className="backgroundAnimationTop absolute h-[700px] w-[700px] pointer-events-none select-none"
                priority
            />
            <Image
                src={gradiants}
                alt=""
                aria-hidden="true"
                className="backgroundAnimation absolute h-[700px] w-[700px] pointer-events-none select-none"
            />
            <div className="absolute inset-0 z-10 pointer-events-auto">
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
        </div>
    );
}