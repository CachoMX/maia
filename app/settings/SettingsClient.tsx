'use client'

import { useState, useEffect } from 'react'
import {
  User,
  Bell,
  Monitor,
  Info,
  Save,
  X,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string | null
  department: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

interface SettingsClientProps {
  initialProfile: UserProfile
}

type TabType = 'profile' | 'notifications' | 'display' | 'system'

interface NotificationPreferences {
  emailUrgentCases: boolean
  emailCaseAssignments: boolean
  emailUpcomingMeetings: boolean
  emailDailyDigest: boolean
  browserPushNotifications: boolean
}

interface DisplayPreferences {
  theme: 'light' | 'dark'
  language: 'en' | 'es'
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY'
  timeFormat: '12h' | '24h'
}

export default function SettingsClient({ initialProfile }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [formData, setFormData] = useState({
    first_name: initialProfile.first_name || '',
    last_name: initialProfile.last_name || '',
    department: initialProfile.department || '',
    phone: initialProfile.phone || '',
  })
  const [originalData, setOriginalData] = useState(formData)

  // Notification preferences (UI only for MVP)
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    emailUrgentCases: true,
    emailCaseAssignments: true,
    emailUpcomingMeetings: true,
    emailDailyDigest: false,
    browserPushNotifications: false,
  })

  // Display preferences (UI only for MVP)
  const [display, setDisplay] = useState<DisplayPreferences>({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(originalData)

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [saveSuccess])

  useEffect(() => {
    if (saveError) {
      const timer = setTimeout(() => setSaveError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [saveError])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required'
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required'
    }

    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      const response = await fetch(`/api/users/${profile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile')
      }

      // Update profile and original data
      setProfile(result.data)
      setOriginalData(formData)
      setSaveSuccess(true)
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setValidationErrors({})
  }

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'SSS_STAFF':
        return 'bg-blue-100 text-blue-800'
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      case 'TEACHER':
        return 'bg-green-100 text-green-800'
      case 'PRINCIPAL_ADMIN':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const tabs = [
    { id: 'profile' as TabType, name: 'Profile', icon: User },
    { id: 'notifications' as TabType, name: 'Notifications', icon: Bell },
    { id: 'display' as TabType, name: 'Display', icon: Monitor },
    { id: 'system' as TabType, name: 'System', icon: Info },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your profile, preferences, and system settings</p>
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-green-800 font-medium">Changes saved successfully</p>
            <p className="text-green-700 text-sm">Your profile has been updated.</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error saving changes</p>
            <p className="text-red-700 text-sm">{saveError}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#0066CC] text-[#0066CC] bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#0066CC]" />
                  <span>Profile Information</span>
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Update your personal information and contact details.
                </p>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {formData.first_name.charAt(0)}{formData.last_name.charAt(0)}
                </div>
                <div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm font-medium">
                    <Camera className="h-4 w-4" />
                    <span>Upload Photo</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-colors ${
                      validationErrors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {validationErrors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.first_name}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-colors ${
                      validationErrors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {validationErrors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.last_name}</p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="h-[42px] flex items-center">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getRoleBadgeColor(profile.role)}`}>
                      {profile.role || 'No Role'}
                    </span>
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department / Title
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-colors"
                    placeholder="e.g., Student Support Services"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-colors ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+34 123 456 789"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {hasUnsavedChanges && (
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#0066CC] text-white rounded-lg hover:bg-[#0052A3] transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-[#0066CC]" />
                  <span>Notification Preferences</span>
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Choose how you want to be notified about cases, meetings, and updates.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    Note: Notification preferences will be fully functional in a future update. These settings are for demonstration purposes only.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Urgent Cases</p>
                        <p className="text-sm text-gray-600">Receive emails when urgent cases are created</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailUrgentCases}
                        onChange={(e) => setNotifications(prev => ({ ...prev, emailUrgentCases: e.target.checked }))}
                        className="h-5 w-5 text-[#0066CC] rounded focus:ring-[#0066CC]"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Case Assignments</p>
                        <p className="text-sm text-gray-600">Get notified when cases are assigned to you</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailCaseAssignments}
                        onChange={(e) => setNotifications(prev => ({ ...prev, emailCaseAssignments: e.target.checked }))}
                        className="h-5 w-5 text-[#0066CC] rounded focus:ring-[#0066CC]"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Upcoming Meetings</p>
                        <p className="text-sm text-gray-600">Reminders for scheduled meetings</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailUpcomingMeetings}
                        onChange={(e) => setNotifications(prev => ({ ...prev, emailUpcomingMeetings: e.target.checked }))}
                        className="h-5 w-5 text-[#0066CC] rounded focus:ring-[#0066CC]"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900">Daily Digest</p>
                        <p className="text-sm text-gray-600">Daily summary of your cases and activities</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailDailyDigest}
                        onChange={(e) => setNotifications(prev => ({ ...prev, emailDailyDigest: e.target.checked }))}
                        className="h-5 w-5 text-[#0066CC] rounded focus:ring-[#0066CC]"
                      />
                    </label>
                  </div>
                </div>

                {/* Browser Notifications */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Browser Notifications</h3>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive browser push notifications for important updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.browserPushNotifications}
                      onChange={(e) => setNotifications(prev => ({ ...prev, browserPushNotifications: e.target.checked }))}
                      className="h-5 w-5 text-[#0066CC] rounded focus:ring-[#0066CC]"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Display Tab */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Monitor className="h-5 w-5 text-[#0066CC]" />
                  <span>Display Preferences</span>
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Customize how the application looks and displays information.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    Note: Display preferences will be fully functional in a future update. These settings are for demonstration purposes only.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDisplay(prev => ({ ...prev, theme: 'light' }))}
                      className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
                        display.theme === 'light'
                          ? 'border-[#0066CC] bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="h-8 w-8 bg-white border border-gray-300 rounded"></div>
                      <span className="font-medium text-gray-900">Light</span>
                    </button>
                    <button
                      onClick={() => setDisplay(prev => ({ ...prev, theme: 'dark' }))}
                      className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-colors ${
                        display.theme === 'dark'
                          ? 'border-[#0066CC] bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="h-8 w-8 bg-gray-800 border border-gray-700 rounded"></div>
                      <span className="font-medium text-gray-900">Dark</span>
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={display.language}
                    onChange={(e) => setDisplay(prev => ({ ...prev, language: e.target.value as 'en' | 'es' }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish (Español)</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={display.dateFormat}
                    onChange={(e) => setDisplay(prev => ({ ...prev, dateFormat: e.target.value as 'MM/DD/YYYY' | 'DD/MM/YYYY' }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-colors"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (European Format)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Example: {display.dateFormat === 'MM/DD/YYYY' ? '11/19/2025' : '19/11/2025'}
                  </p>
                </div>

                {/* Time Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Format
                  </label>
                  <select
                    value={display.timeFormat}
                    onChange={(e) => setDisplay(prev => ({ ...prev, timeFormat: e.target.value as '12h' | '24h' }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent transition-colors"
                  >
                    <option value="12h">12-hour (AM/PM)</option>
                    <option value="24h">24-hour</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Example: {display.timeFormat === '12h' ? '2:30 PM' : '14:30'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Info className="h-5 w-5 text-[#0066CC]" />
                  <span>System Information</span>
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  View account details and system status information.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Account Created */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Account Created</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(profile.created_at)}
                    </p>
                  </div>

                  {/* Last Updated */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDateTime(profile.updated_at)}
                    </p>
                  </div>

                  {/* User ID */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">User ID</p>
                    <p className="text-sm font-mono text-gray-900 break-all">
                      {profile.id}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">For support reference</p>
                  </div>

                  {/* System Version */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">System Version</p>
                    <p className="text-lg font-semibold text-gray-900">v1.0.0 (MVP)</p>
                  </div>

                  {/* Database Status */}
                  <div className="p-4 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                    <p className="text-sm text-gray-600 mb-2">Database Status</p>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-lg font-semibold text-green-700">Connected</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Supabase PostgreSQL</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">About Maia SSS</h3>
                  <p className="text-sm text-blue-800">
                    Maia is the Student Support Services tracking system for ATLAS American School of Malaga.
                    This platform helps SSS staff manage cases, interventions, meetings, and student support activities.
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    For support or questions, please contact your system administrator.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
