import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '../../utils/handles'

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
// }

export default function DropDown({ children, menus, position = "origin-top-right", buttonClicked, btnStyle }) {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                {children}
                {/* <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </Menu.Button> */}
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className={classNames("bg-gray-100 absolute z-50 p-2 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none", position)}>
                    {menus.map((menu) => (
                        <Menu.Item key={menu.id} className={classNames(btnStyle ? btnStyle : "")}>
                            {({ active }) => (
                                <button
                                    className={classNames(
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                        'group flex items-center px-4 py-2 text-sm space-x-3 w-full'
                                    )}
                                    onClick={() => buttonClicked(menu.id)}
                                >
                                    {menu?.icon && <img src={`/icons/${menu.icon}`} alt={menu.alt} className="h-5 w-5" aria-hidden="true" />
                                    }
                                    {menu.iconComponent && menu.iconComponent}
                                    <span className='whitespace-nowrap'>
                                        {menu.name}
                                    </span>
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
