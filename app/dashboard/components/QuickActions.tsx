'use client'

import Link from 'next/link'

interface ActionButtonProps {
  title: string
  description: string
  icon: string
  href: string
}

function ActionButton({ title, description, icon, href }: ActionButtonProps) {
  return (
    <Link
      href={href}
      className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-[#0066CC] hover:bg-blue-50 transition-all text-left group"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 group-hover:text-[#0066CC]">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </Link>
  )
}

export function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionButton
          title="Create Case"
          description="New student case"
          icon="➕"
          href="/cases/new"
        />
        <ActionButton
          title="Document Session"
          description="Add intervention notes"
          icon="📝"
          href="/sessions/new"
        />
        <ActionButton
          title="Schedule Meeting"
          description="Schedule parent meeting"
          icon="📅"
          href="/meetings/new"
        />
      </div>
    </div>
  )
}
