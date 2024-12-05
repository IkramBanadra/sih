import { motion } from "framer-motion";
import { CircleCheckBig, Search, Trash2 } from "lucide-react";
import { useState } from "react";

const PRODUCT_DATA = [
	{ id: 1, name: "Energy Saved", Examples: "Installation of LED lights",Measurements:"Units of electricity saved (kWh).", Acitivity:"Adoption of energy-efficient practices in post offices.",Image:"https://media.istockphoto.com/id/2156966176/photo/environmental-concept-with-hand-holding-planet-earth-showing-sustainable-and-eco-friendly.jpg?s=2048x2048&w=is&k=20&c=GTSsJTLGc5o3fyllKTGZcIScG0cl_f6svX6K-7RzF50=" },
    { id: 2, name: "Reduced E-Waste", Examples: "Proper disposal of old computers, printers, and other electronic devices.", Measurements:"Weight of e-waste recycled (kg)",Acitivity:"E-waste reduction and awareness", Image:"https://plus.unsplash.com/premium_photo-1679607652654-795f81397b22?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 3, name: "Sustainable Food System Adopted", Examples: "Organizing awareness sessions about millet-based diets for employees and the public",Measurements:"Number of awareness events conducted",Acitivity:"Promotion of sustainable food practices.",Image:"https://media.istockphoto.com/id/1428737914/photo/smart-farm-agricultural-technology-and-organic-agriculture.jpg?s=2048x2048&w=is&k=20&c=1HqaC5iyiQlQUFGc7gHf124wDHR0XrGVtP0cQy003v0=" },
    { id: 4, name: "Single-Use Plastic Reduced", Examples: "Using biodegradable packaging for parcel delivery", Measurements:"Quantity of single-use plastic avoided (kg)",Acitivity:" Minimizing plastic usage in operations", Image:"https://media.istockphoto.com/id/1095988308/vector/say-no-to-plastic-bag-vector-illustration-plastic-bag-rejection-to-save-the-environment-no.jpg?s=2048x2048&w=is&k=20&c=eR6bxhF313x_T5g8ONpZqRdhBsGOLJu0sZIIn5dC6I8=" },
    { id: 5, name: "Lifestyle Changes Adopted", Examples: "Promoting cycling or walking for short-distance deliveries", Measurements:"Reduction in paper consumption (number of sheets saved).",Acitivity:"Encouraging eco-friendly behaviors", Image:"https://media.istockphoto.com/id/1278984681/photo/paper-cardboard-cartoon-used-waste-with-a-recycling-sign.jpg?s=2048x2048&w=is&k=20&c=Xs5Cb-MxHJIlvphWpK48uaadngjyJhMQ8iNRR3vmVjQ=" },
];

const LifeTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(PRODUCT_DATA);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const terms = term.split(' ').filter(t => t);

        const filtered = PRODUCT_DATA.filter((product) => {
            const productName = product.name.toLowerCase();
            const productExamples = product.Examples.toLowerCase();

            return terms.every(t => productName.includes(t) || productExamples.includes(t));
        });

        setFilteredProducts(filtered);
    };

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Product List</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='Search products...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={handleSearch}
                        value={searchTerm}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Name
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Examples
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Measurements
                            </th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                                Activity
                            </th>
                        </tr>
                    </thead>

                    <tbody className='divide-y divide-gray-700'>
                        {filteredProducts.map((product) => (
                            <motion.tr
                                key={product.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
                                    <img
                                        src={product.Image}
                                        alt={`Image of ${product.name}`}
                                        className='w-10 h-10 rounded-full'
                                    />
                                    {product.name}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    {product.Examples}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    {product.Measurements}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    {product.Acitivity}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                    <button className='text-indigo-400 hover:text-indigo-300 mr-2'>
                                        <CircleCheckBig size={18} />
                                    </button>
                                    <button className='text-red-400 hover:text-red-300'>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};
export default LifeTable;