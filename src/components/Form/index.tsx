import React, { useState } from "react";
import { View, TextInput, Image, Text, TouchableOpacity } from "react-native";
import { ArrowLeft } from "phosphor-react-native";
import { captureScreen } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";

import { styles } from "./styles";
import { theme } from "../../theme";
import { FeedbackType } from "../Widget";
import { feedbackTypes } from "../../utils/feedbackTypes";
import { ScreenshotButton } from "../ScreenshotButton";
import { Button } from "../Button";
import { api } from "../../libs/axios";

interface IProps {
    feedbackType: FeedbackType;
    onFeedbackCancel: () => void;
    onFeedbackSent: () => void;
}

export function Form({
    feedbackType,
    onFeedbackCancel,
    onFeedbackSent,
}: IProps) {
    const feedbackTypeInfo = feedbackTypes[feedbackType];

    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState("");

    function handleScreenshot() {
        captureScreen({
            format: "jpg",
            quality: 0.8,
        })
            .then((uri) => setScreenshot(uri))
            .catch((error) => console.log(error));
    }

    function handleScreenshotRemove() {
        setScreenshot(null);
    }

    async function handleSendFeedback() {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        const screenshotBase64 =
            screenshot &&
            (await FileSystem.readAsStringAsync(screenshot, {
                encoding: "base64",
            }));

        try {
            await api.post("/feedbacks", {
                type: feedbackType,
                comment,
                screenshot: `data:image/png;base64,${screenshotBase64}`,
            });

            onFeedbackSent();
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onFeedbackCancel}>
                    <ArrowLeft
                        size="24"
                        weight="bold"
                        color={theme.colors.text_secondary}
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Image
                        source={feedbackTypeInfo.image}
                        style={styles.image}
                    />
                    <Text style={styles.titleText}>
                        {feedbackTypeInfo.title}
                    </Text>
                </View>
            </View>

            <TextInput
                multiline
                autoCorrect={false}
                style={styles.input}
                placeholder="Conte com detalhes o que está acontecendo..."
                placeholderTextColor={theme.colors.text_secondary}
                onChangeText={setComment}
            />

            <View style={styles.footer}>
                <ScreenshotButton
                    onTakeShot={handleScreenshot}
                    onRemoveShot={handleScreenshotRemove}
                    screenshot={screenshot}
                />
                <Button isLoading={isLoading} onPress={handleSendFeedback} />
            </View>
        </View>
    );
}
