import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Eye, EyeOff } from "lucide-react";

type PasswordStrength = "unsafe" | "safe" | "strong";

interface PasswordCheck {
  label: string;
  test: (password: string) => boolean;
}

const passwordChecks: PasswordCheck[] = [
  { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { label: "Contains uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "Contains lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "Contains number", test: (pwd) => /\d/.test(pwd) },
  { label: "Contains special character", test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

const generatePassword = (): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*(),.?\":{}|<>";
  
  const allChars = lowercase + uppercase + numbers + symbols;
  const mandatoryChars = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  
  const randomChars = Array.from({ length: 8 }, () => 
    allChars[Math.floor(Math.random() * allChars.length)]
  );
  
  const password = [...mandatoryChars, ...randomChars]
    .sort(() => Math.random() - 0.5)
    .join("");
    
  return password;
};

export const PasswordValidator = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pwd: string): PasswordStrength => {
    const passedChecks = passwordChecks.filter(check => check.test(pwd));
    
    if (passedChecks.length <= 2) return "unsafe";
    if (passedChecks.length <= 4) return "safe";
    return "strong";
  };

  const getStrengthConfig = (strength: PasswordStrength) => {
    switch (strength) {
      case "strong":
        return {
          color: "success",
          bgColor: "bg-success/10",
          borderColor: "border-success",
          textColor: "text-success",
          label: "Strong Password",
          progress: 100,
        };
      case "safe":
        return {
          color: "warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning",
          textColor: "text-warning",
          label: "Safe Password",
          progress: 60,
        };
      case "unsafe":
        return {
          color: "danger",
          bgColor: "bg-danger/10",
          borderColor: "border-danger",
          textColor: "text-danger",
          label: "Unsafe Password",
          progress: 30,
        };
    }
  };

  const strength = getPasswordStrength(password);
  const config = getStrengthConfig(strength);
  const passedChecks = passwordChecks.filter(check => check.test(password));

  const handleGeneratePassword = () => {
    setPassword(generatePassword());
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Password Validator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Enter Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`pr-10 ${config.borderColor}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-10"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {password && (
          <>
            <div className={`p-3 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${config.textColor}`}>
                  {config.label}
                </span>
                <span className={`text-sm ${config.textColor}`}>
                  {passedChecks.length}/{passwordChecks.length}
                </span>
              </div>
              <Progress 
                value={config.progress} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Requirements:</h4>
              <ul className="space-y-1">
                {passwordChecks.map((check, index) => {
                  const passed = check.test(password);
                  return (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        passed ? "bg-success" : "bg-muted"
                      }`} />
                      <span className={passed ? "text-success" : "text-muted-foreground"}>
                        {check.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {strength === "unsafe" && (
              <Button 
                onClick={handleGeneratePassword}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Strong Password
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};