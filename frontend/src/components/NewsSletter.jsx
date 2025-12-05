import { CalendarDaysIcon, HandRaisedIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function Newsletter() {
    const links = [
        { title: 'Contact Email', description: 'info@inkandpixel.com', icon: EnvelopeIcon, href: 'mailto:info@inkandpixel.com' },
        { title: 'Phone', description: '+1 (555) 123-4567', icon: PhoneIcon, href: 'tel:+15551234567' },
        { title: 'About Us', description: 'Learn more about Ink & Pixel', icon: CalendarDaysIcon, href: '/aboutus' },
        { title: 'Blog', description: 'Read our latest posts', icon: HandRaisedIcon, href: '/blogs' },
    ];

    return (
        <div className="relative isolate overflow-hidden bg-gray-900 py-10 sm:py-20 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Main Container with Two Columns */}
                <div className="mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

                    {/* Left Column */}
                    <div className="space-y-12">
                        {/* Newsletter Signup */}
                        <div className="bg-gray-800 rounded-2xl p-8 sm:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">Subscribe to our newsletter</h2>
                            <p className="mt-4 text-gray-300 text-base sm:text-lg">
                                Stay updated with the latest images, videos, and blogs from Ink & Pixel.
                            </p>
                            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="flex-1 rounded-md bg-white/5 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-indigo-500 px-5 py-2.5 text-white font-semibold hover:bg-indigo-400 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {links.map((link, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-4 bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="rounded-full bg-indigo-500 p-3 flex-shrink-0">
                                        <link.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <dt className="text-white font-semibold">{link.title}</dt>
                                        <dd className="mt-1 text-gray-400">
                                            <a href={link.href} className="hover:underline">{link.description}</a>
                                        </dd>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Contact Us Form */}
                    <div className="bg-gray-800 rounded-2xl p-8 sm:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">Contact Us</h2>
                        <p className="mt-4 text-gray-300 text-base sm:text-lg">
                            Have questions? Send us a message and we’ll get back to you.
                        </p>
                        <form className="mt-6 space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                required
                                className="w-full rounded-md bg-white/5 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                required
                                className="w-full rounded-md bg-white/5 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="tel"
                                placeholder="Your Phone"
                                className="w-full rounded-md bg-white/5 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <textarea
                                rows={4}
                                placeholder="Your Message"
                                required
                                className="w-full rounded-md bg-white/5 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="w-full rounded-md bg-indigo-500 px-5 py-2.5 text-white font-semibold hover:bg-indigo-400 transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Background Gradient Shape */}
            <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="aspect-1155/678 w-[72rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                />
            </div>
        </div>
    )
}
