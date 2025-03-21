import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthInput } from "./AuthInput";
import { AuthInputProps } from "@/types/auth";

describe("AuthInput", () => {
    const defaultProps: AuthInputProps = {
        type: "text",
        placeholder: "Enter text",
        value: "",
        onChange: jest.fn(),
        icon: <span>Icon</span>,
    };

    it("renders the input field with the correct placeholder", () => {
        render(<AuthInput {...defaultProps} />);
        const inputElement = screen.getByPlaceholderText(/enter text/i);
        expect(inputElement).toBeInTheDocument();
    });

    it("renders the icon inside the input field", () => {
        render(<AuthInput {...defaultProps} />);
        const iconElement = screen.getByText(/icon/i);
        expect(iconElement).toBeInTheDocument();
    });

    it("calls onChange function when input value changes", () => {
        render(<AuthInput {...defaultProps} />);
        const inputElement = screen.getByPlaceholderText(/enter text/i);
        fireEvent.change(inputElement, { target: { value: "new value" } });
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it("renders the input field with the correct type", () => {
        render(<AuthInput {...defaultProps} type="password" />);
        const inputElement = screen.getByPlaceholderText(/enter text/i);
        expect(inputElement).toHaveAttribute("type", "password");
    });

    it("renders the input field with the correct value", () => {
        render(<AuthInput {...defaultProps} value="test value" />);
        const inputElement = screen.getByPlaceholderText(/enter text/i);
        expect(inputElement).toHaveValue("test value");
    });
});
