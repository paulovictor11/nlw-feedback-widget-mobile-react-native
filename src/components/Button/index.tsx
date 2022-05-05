import React from "react";
import {
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
    ActivityIndicator,
} from "react-native";
import { theme } from "../../theme";

import { styles } from "./styles";

interface IProps extends TouchableOpacityProps {
    isLoading: boolean;
}

export function Button({ isLoading, ...rest }: IProps) {
    return (
        <TouchableOpacity style={styles.container} {...rest}>
            {isLoading ? (
                <ActivityIndicator color={theme.colors.text_on_brand_color} />
            ) : (
                <Text style={styles.title}>Enviar feedback</Text>
            )}
        </TouchableOpacity>
    );
}
