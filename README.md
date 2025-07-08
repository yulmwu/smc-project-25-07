App name: smc
Frontend name: smc-frontend
Backend name: smc-backend

ECR -> ECS Fargate

VPC: 10.0.0.0/16

Public Subnet A: 10.0.0.0/24, NAT Gateway (Availability Zone 1)
Private Subnet A: 10.0.1.0/24, Frontend Fargate/Backend Fargate (Availability Zone 1)

Public Subnet B: 10.0.2.0/24, NAT Gateway (Availability Zone 2)
Private Subnet B: 10.0.3.0/24, Frontend Fargate/Backend Fargate (Availability Zone 2)

ALB:
-   Private Subnet A, Private Subnet B
-   Listener Rule: / => Frontend Fargate, /api => Backend Fargate



AWS Service

- ECR
    - smc-frontend-repo
    - smc-backend-repo
- ECS Fargate
    - smc-frontend-service
    - smc-backend-service
- IAM Roles
    - smc-frontend-task-role
    - smc-backend-task-role
    - smc-frontend-execution-role
    - smc-backend-execution-role
- VPC
    - Public Subnet A: smc-public-subnet-a
    - Private Subnet A: smc-private-subnet-a
    - Public Subnet B: smc-public-subnet-b
    - Private Subnet B: smc-private-subnet-b
- Security Groups
    - smc-frontend-sg
    - smc-backend-sg
- NAT Gateway
    - smc-nat-gateway-a
    - smc-nat-gateway-b
- ALB
    - smc-alb
    - smc-alb-listener
    - smc-alb-target-group-frontend
    - smc-alb-target-group-backend
