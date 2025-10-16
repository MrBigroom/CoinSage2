import React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}