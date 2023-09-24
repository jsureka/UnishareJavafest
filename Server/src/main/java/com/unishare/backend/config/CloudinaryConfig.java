package com.unishare.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary getCloudinary() {
        Map <Object, Object> config = new HashMap<>();
        config.put("cloud_name", "dvzj3k20y");
        config.put("api_key", "875798795622912");
        config.put("api_secret", "hXbIAbyc9MPZ8GTnNd9l_nU_GVM");
        config.put("secure", true);
        return new Cloudinary(config);
    }
}
