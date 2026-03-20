

import React from "react"
import { FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
	return (
		<>
			<div className="bg-white h-full w-full flex md:flex-row flex-col justify-between pt-10 items-start rounded-3xl">
				<div className="p-5">
					<ul>
						<p className="text-slate-700 font-bold text-2xl pb-4">
							MENTAL<span className="text-violet-600">CARE</span>
						</p>
						<div className="flex gap-4 pb-4">
							<FaInstagram className="text-xl cursor-pointer hover:text-yellow-600" />
							<FaTwitter className="text-xl cursor-pointer hover:text-blue-500" />
							<FaLinkedin className="text-xl cursor-pointer hover:text-blue-500" />
							<FaYoutube className="text-xl cursor-pointer hover:text-red-600" />
						</div>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-slate-700 font-bold text-lg pb-3">Services</p>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Therapy Sessions
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Mental Health Workshops
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Online Counseling
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Support Groups
						</li>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-slate-700 font-bold text-lg pb-3">About Us</p>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Our Mission
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Our Team
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Testimonials
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Careers
						</li>
					</ul>
				</div>
				<div className="p-5">
					<ul>
						<p className="text-slate-700 font-bold text-lg pb-3">Resources</p>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Blog
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							FAQs
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Mental Health Guides
						</li>
						<li className="text-slate-500 text-sm pb-2 font-medium hover:text-violet-600 cursor-pointer">
							Helplines
						</li>
					</ul>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center text-center p-5 bg-white">
				<h1 className="text-slate-600 text-sm font-medium">
					© 2024-2025 All rights reserved | Empowering minds with ❤ by {" "}
					<span className="hover:text-blue-500 font-medium cursor-pointer">
						MentalCare Foundation
					</span>
				</h1>
			</div>
		</>
	);
};

export default Footer
