import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import {
  Shield,
  Upload,
  Camera,
  CheckCircle,
  AlertTriangle,
  X,
  FileText,
  User,
  CreditCard,
} from 'lucide-react'

interface KycModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

type KycStep = 'intro' | 'document' | 'liveness' | 'review' | 'complete'
type KycStatus = 'pending' | 'approved' | 'rejected' | 'reviewing'
type DocumentType = 'passport' | 'drivers_license' | 'national_id'

/**
 * KYC/AML Modal Component
 * 
 * Sumsub-style workflow with biometric liveness detection
 * 
 * Features:
 * - Document upload (ID, Passport, Driver's License)
 * - Liveness detection simulation (webcam mock)
 * - Risk scoring (1-5 scale)
 * - Sanctions screening placeholder
 * - SAR (Suspicious Activity Report) stub generation
 * 
 * Integration Path:
 * 1. Mock implementation (current) - for prototype/testing
 * 2. Real Sumsub SDK integration:
 *    - npm install @sumsub/websdk @sumsub/websdk-react
 *    - Cost: $0.88-3/verification
 *    - Timeline: 4-6 weeks for full integration
 *    - Docs: https://developers.sumsub.com/
 * 
 * Alternative providers:
 * - Onfido ($1.5-4/verification)
 * - Jumio ($2-5/verification)
 * - Persona ($1-3/verification)
 */
export default function KycModal({ isOpen, onClose, onComplete }: KycModalProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<KycStep>('intro')
  const [documentType, setDocumentType] = useState<DocumentType>('passport')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [riskScore, setRiskScore] = useState<number>(0)

  if (!isOpen) return null

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
        return
      }
      setDocumentFile(file)
      toast.success('Document uploaded successfully')
    }
  }

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      setSelfieFile(file)
      toast.success('Selfie captured successfully')
    }
  }

  const simulateLivenessCheck = async () => {
    setLoading(true)
    // Simulate biometric liveness detection
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Mock risk scoring (1-5 scale)
    const mockRiskScore = Math.floor(Math.random() * 3) + 1 // 1-3 for demo
    setRiskScore(mockRiskScore)
    
    setLoading(false)
    setStep('review')
  }

  const performSanctionsScreening = async () => {
    // Mock sanctions screening
    // Real implementation would check:
    // - PEP (Politically Exposed Persons) databases
    // - OFAC sanctions lists
    // - EU sanctions lists
    // - Adverse media screening
    
    // Integration: ComplyAdvantage API ($500/mo base)
    // Alternative: Dow Jones Risk & Compliance ($1000/mo)
    
    return {
      isPEP: false,
      isSanctioned: false,
      adverseMedia: false,
      riskLevel: riskScore <= 2 ? 'low' : riskScore === 3 ? 'medium' : 'high',
    }
  }

  const submitKyc = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Perform sanctions screening
      const screeningResult = await performSanctionsScreening()

      // Determine KYC status based on risk score and screening
      let status: KycStatus = 'reviewing'
      if (screeningResult.isSanctioned || screeningResult.adverseMedia) {
        status = 'rejected'
      } else if (riskScore <= 2) {
        status = 'approved'
      }

      // Update user KYC status in database
      const { error } = await supabase
        .from('profiles')
        .update({
          kyc_status: status,
          kyc_risk_score: riskScore,
          kyc_completed_at: new Date().toISOString(),
          kyc_document_type: documentType,
        })
        .eq('id', user.id)

      if (error) throw error

      // Generate SAR stub if high risk
      if (riskScore >= 4) {
        await generateSARStub(user.id, riskScore, screeningResult)
      }

      setStep('complete')
      toast.success(
        status === 'approved'
          ? 'KYC verification approved!'
          : 'KYC submitted for review'
      )

      setTimeout(() => {
        onComplete?.()
        onClose()
      }, 2000)
    } catch (error: any) {
      console.error('KYC submission error:', error)
      toast.error('Failed to submit KYC verification')
    } finally {
      setLoading(false)
    }
  }

  const generateSARStub = async (userId: string, risk: number, screening: any) => {
    // Suspicious Activity Report (SAR) stub generation
    // Real implementation would:
    // 1. Log to compliance database
    // 2. Generate report in FinCEN format
    // 3. Notify compliance officer
    // 4. Queue for manual review
    
    console.log('SAR Generated:', {
      userId,
      timestamp: new Date().toISOString(),
      riskScore: risk,
      screeningResult: screening,
      reason: 'High risk score detected',
      status: 'pending_review',
    })

    // Store in database
    await supabase.from('compliance_logs').insert({
      user_id: userId,
      event_type: 'SAR_GENERATED',
      risk_score: risk,
      details: screening,
      created_at: new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">KYC Verification</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Intro Step */}
          {step === 'intro' && (
            <div className="space-y-6">
              <div className="text-center">
                <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Verify Your Identity
                </h3>
                <p className="text-gray-400">
                  Complete KYC verification to unlock full platform features and comply
                  with regulatory requirements.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  What you'll need:
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Government-issued ID (Passport, Driver's License, or National ID)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Clear selfie photo for liveness verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>5-10 minutes to complete the process</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-semibold mb-1">Regulatory Compliance</p>
                    <p className="text-yellow-300/80">
                      KYC/AML verification is required under US Crypto Act 2025, EU MiCA, and
                      AMLD6 regulations. Non-compliance may result in fines up to €5M.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('document')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Start Verification
              </button>
            </div>
          )}

          {/* Document Upload Step */}
          {step === 'document' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Upload Identity Document
                </h3>
                <p className="text-gray-400">
                  Select your document type and upload a clear photo
                </p>
              </div>

              {/* Document Type Selection */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'passport' as DocumentType, label: 'Passport', icon: FileText },
                  { type: 'drivers_license' as DocumentType, label: "Driver's License", icon: CreditCard },
                  { type: 'national_id' as DocumentType, label: 'National ID', icon: User },
                ].map(({ type, label, icon: Icon }) => (
                  <button
                    key={type}
                    onClick={() => setDocumentType(type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      documentType === type
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      documentType === type ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm ${
                      documentType === type ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {label}
                    </p>
                  </button>
                ))}
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <input
                  type="file"
                  id="document-upload"
                  accept="image/*"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <label
                  htmlFor="document-upload"
                  className="cursor-pointer text-blue-500 hover:text-blue-400 font-semibold"
                >
                  Click to upload
                </label>
                <p className="text-gray-400 text-sm mt-2">
                  or drag and drop (PNG, JPG up to 10MB)
                </p>
                {documentFile && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    <span>{documentFile.name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('intro')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('liveness')}
                  disabled={!documentFile}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Liveness Check Step */}
          {step === 'liveness' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Liveness Verification
                </h3>
                <p className="text-gray-400">
                  Take a selfie to verify you're the document holder
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 text-center">
                <Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">
                  Position your face in the frame and capture a clear selfie
                </p>
                
                {/* Mock Webcam Preview */}
                <div className="bg-gray-900 rounded-lg aspect-video mb-4 flex items-center justify-center border border-gray-700">
                  <User className="w-24 h-24 text-gray-600" />
                </div>

                <input
                  type="file"
                  id="selfie-upload"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  className="hidden"
                />
                <label
                  htmlFor="selfie-upload"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg cursor-pointer transition-colors"
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Capture Selfie
                </label>

                {selfieFile && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-500">
                    <CheckCircle className="w-5 h-5" />
                    <span>Selfie captured successfully</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <strong>Biometric Technology:</strong> We use advanced liveness detection
                  to prevent fraud from masks, photos, or deepfakes. This ensures secure
                  onboarding and protects your account.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('document')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={simulateLivenessCheck}
                  disabled={!selfieFile || loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify Liveness'}
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Review & Submit
                </h3>
                <p className="text-gray-400">
                  Verify your information before submitting
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Verification Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Document Type:</span>
                      <span className="text-white capitalize">{documentType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Document:</span>
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Uploaded
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Liveness Check:</span>
                      <span className="text-green-500 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Passed
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk Score:</span>
                      <span className={`font-semibold ${
                        riskScore <= 2 ? 'text-green-500' : riskScore === 3 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {riskScore}/5 ({riskScore <= 2 ? 'Low' : riskScore === 3 ? 'Medium' : 'High'})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Compliance Screening</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>PEP screening: Clear</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>Sanctions check: Clear</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span>Adverse media: Clear</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 text-xs text-gray-400">
                <p>
                  By submitting, you confirm that all information provided is accurate and
                  agree to our Terms of Service and Privacy Policy. Your data will be
                  processed in accordance with GDPR, CCPA, and applicable AML/CFT regulations.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('liveness')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={submitKyc}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Verification'}
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Verification Complete!
              </h3>
              <p className="text-gray-400 mb-6">
                Your KYC verification has been {riskScore <= 2 ? 'approved' : 'submitted for review'}.
                {riskScore <= 2 && ' You can now access all platform features.'}
              </p>
              {riskScore > 2 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-200">
                    Your verification is under manual review. This typically takes 24-48 hours.
                    We'll notify you once the review is complete.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Integration Notes */}
        <div className="border-t border-gray-800 p-4 bg-gray-800/30">
          <p className="text-xs text-gray-500 text-center">
            🔧 <strong>Integration Note:</strong> This is a mock KYC flow for prototype testing.
            For production, integrate Sumsub SDK (npm i @sumsub/websdk) - $0.88-3/verification, 4-6 weeks implementation.
            Alternative: Onfido, Jumio, or Persona. See docs for real biometric liveness and AML screening.
          </p>
        </div>
      </div>
    </div>
  )
}
