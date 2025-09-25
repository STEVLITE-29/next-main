import { CircleCheck, CircleX } from 'lucide-react';

const PasswordCriteria = ({password}: {password: string}) => {
    const criteria = [
        {label: "At least 8 characters", isValid: password.length >= 8},
        {label: "At least 1 lowercase and 1 uppercase letter", isValid: /[A-Z][a-z]/.test(password)},
        {label: "At least 1 number", isValid: /\d/.test(password)},
        {label: "At least 1 special character", isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password)},
    ];

    return (
        <div className="mt-1 space-y-1">
            {criteria.map((item) => (
                <div key={item.label} className="flex items-center text-xs">
                    {item.isValid ? (
                        <CircleCheck className="text-green-500 w-4 h-4 mr-2" />
                    ) : (
                        <CircleX className="text-gray-500 w-4 h-4 mr-2" />
                    )}
                    <span className={item.isValid ? "text-green-500" : "text-gray-500"}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}

const PasswordStrengthMeter = ({password}: {password: string}) => {
    const getStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (pass.match(/[A-Z]/) && pass.match(/[a-z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[!@#$%^&*(),.?":{}|<>]/)) strength++;
        return strength;
    };
    const strength = getStrength(password);

    const strengthColor = (strength: number) => {
        switch (strength) {
            case 0:
                return "bg-red-500";
            case 1:
                return "bg-orange-500";
            case 2:
                return "bg-yellow-500";
            case 3:
                return "bg-yellow-300";
            case 4:
                return "bg-green-500";
            default:
                return "bg-red-500";
        }
    };

    const getStrengthText = (strength: number) => {
        switch (strength) {
            case 0:
                return "Very Weak";
            case 1:
                return "Weak";
            case 2:
                return "Moderate";
            case 3:
                return "Strong";
            case 4:
                return "Very Strong";
            default:
                return "Very Weak";
        }
    }


  return (
    <div className="w-full mt-2 text-xs">
        <div className='flex justify-center items-center mb-2'>
            <span className="text-xs text-gray-400"></span>
            <span className="text-xs text-gray-400">{getStrengthText(strength)}</span>
        </div>

        <div className="flex space-x-1 mb-3">
            {[...Array(4)].map((_, index) => (
                <div 
                    key = {index}
                    className={`
                        h-[2px] w-1/4 rounded-full transition-colors duration-300 
                        ${index < strength ? strengthColor(strength) : "bg-gray-600"}
                    `}
                />
            ))}
        </div>
        <PasswordCriteria password={password} />
    </div>
  )
}

export default PasswordStrengthMeter