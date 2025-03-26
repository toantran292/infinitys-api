#!/bin/bash

# Đợi MinIO khởi động và sẵn sàng
echo "Waiting for MinIO to be ready..."
until mc alias set myminio http://minio:9000 "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" > /dev/null 2>&1
do
    sleep 1
done
echo "Added \`myminio\` successfully."

# Đảm bảo bucket tồn tại
echo "Creating bucket: infinitys"
mc mb --ignore-existing myminio/infinitys
echo "Bucket created successfully \`myminio/infinitys\`."

# Tạo user mới
echo "Creating access key user..."
mc admin user add myminio "$AWS_S3_ACCESS_KEY_ID" "$AWS_S3_SECRET_ACCESS_KEY"
echo "Added user \`$AWS_S3_ACCESS_KEY_ID\` successfully."

# Tạo policy cho bucket infinitys
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket",
                "s3:GetBucketLocation",
                "s3:ListBucketMultipartUploads"
            ],
            "Resource": ["arn:aws:s3:::infinitys"]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListMultipartUploadParts",
                "s3:AbortMultipartUpload"
            ],
            "Resource": ["arn:aws:s3:::infinitys/*"]
        }
    ]
}
EOF

# Tạo và áp dụng policy (sử dụng lệnh mới)
mc admin policy create myminio infinitys-access /tmp/bucket-policy.json
echo "Created policy \`infinitys-access\` successfully."

# Gán policy cho user (sử dụng lệnh mới)
mc admin policy attach myminio infinitys-access --user "$AWS_S3_ACCESS_KEY_ID"
echo "Attached policy \`infinitys-access\` to user \`$AWS_S3_ACCESS_KEY_ID\`"

echo "✅ MinIO init completed!"
