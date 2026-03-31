package com.qubomax.commandcenter.spapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;

@Service
@RequiredArgsConstructor
public class SecretManagerService {

    private final SecretsManagerClient secretsManagerClient;

    @Value("${aws.secrets.sp-api-secret-name:qubomax/sp-api}")
    private String secretName;

    public String getSpApiClientSecret() {
        return getSpApiSecrets().clientSecret();
    }

    public String getSpApiRefreshToken() {
        return getSpApiSecrets().refreshToken();
    }

    public SpApiSecrets getSpApiSecrets() {
        try {
            String rawJson = secretsManagerClient.getSecretValue(
                            GetSecretValueRequest.builder().secretId(secretName).build())
                    .secretString();
            return SpApiSecrets.fromJson(rawJson);
        } catch (SdkException ex) {
            throw new IllegalStateException("Failed to retrieve secret from AWS Secrets Manager: " + secretName, ex);
        }
    }

    public record SpApiSecrets(String clientSecret, String refreshToken) {
        public static SpApiSecrets fromJson(String json) {
            try {
                var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                var node = mapper.readTree(json);
                String clientSecret = node.path("SP_API_CLIENT_SECRET").asText(node.path("clientSecret").asText());
                String refreshToken = node.path("SP_API_REFRESH_TOKEN").asText(node.path("refreshToken").asText());
                if (clientSecret == null || clientSecret.isBlank() || refreshToken == null || refreshToken.isBlank()) {
                    throw new IllegalStateException("Secret is missing SP_API_CLIENT_SECRET or SP_API_REFRESH_TOKEN keys.");
                }
                return new SpApiSecrets(clientSecret, refreshToken);
            } catch (Exception ex) {
                throw new IllegalStateException("Could not parse SP-API secret payload from AWS Secrets Manager.", ex);
            }
        }
    }
}
