import { Section } from "./Section";

export const CompatibleToolsSection = () => {
	return (
		<Section>
			<div className="mx-auto px-4 text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
				<h2 className="text-4xl font-bold">COMPATIBLE TOOLS</h2>
				<div className="mt-8 flex flex-wrap items-center justify-center text-muted-foreground sm:justify-between">
					{/* Apple */}
					<a
						href="#"
						className="mb-10 mr-10 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
					>
						<div className="bg-gray-900 size-20"></div>
					</a>

					{/* Google */}
					<a
						href="#"
						className="mb-10 mr-10 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
					>
						<div className="bg-gray-900 size-20"></div>
					</a>

					{/* Microsoft */}
					<a
						href="#"
						className="mb-10 mr-10 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
					>
						<div className="bg-gray-900 size-20"></div>
					</a>

					{/* Zoom */}
					<a
						href="#"
						className="mb-10 mr-10 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
					>
						<div className="bg-gray-900 size-20"></div>
					</a>

					{/* Discord */}
					<a
						href="#"
						className="mb-10 mr-10 hover:text-gray-800 dark:hover:text-gray-400 lg:mb-0"
					>
						<div className="bg-gray-900 size-20"></div>
					</a>
				</div>
			</div>
		</Section>
	);
};
