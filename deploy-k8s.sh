#!/bin/bash

# Deployment script for PokeDex Kubernetes
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_TYPE=${1:-"server"}  # server, local, or both
NAMESPACE=""
DEPLOYMENT_FILE=""

echo -e "${BLUE}🚀 PokeDex Kubernetes Deployment${NC}"
echo -e "${BLUE}=================================${NC}"

# Function to deploy
deploy_pokedex() {
    local type=$1
    local namespace=$2
    local deployment_file=$3
    
    echo -e "${YELLOW}📦 Deploying PokeDex (${type})...${NC}"
    echo -e "Namespace: ${namespace}"
    echo -e "Deployment file: ${deployment_file}"
    echo ""
    
    # Apply deployment
    kubectl apply -f ${deployment_file}
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Deployment applied successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to apply deployment${NC}"
        return 1
    fi
    
    # Wait for deployments to be ready
    echo -e "${YELLOW}⏳ Waiting for deployments to be ready...${NC}"
    
    if [ "$type" = "local" ]; then
        kubectl wait --for=condition=available --timeout=300s deployment/pokedex-backend-local -n ${namespace}
        kubectl wait --for=condition=available --timeout=300s deployment/modern-pokedex-local -n ${namespace}
    else
        kubectl wait --for=condition=available --timeout=300s deployment/pokedex-backend -n ${namespace}
        kubectl wait --for=condition=available --timeout=300s deployment/modern-pokedex -n ${namespace}
    fi
    
    # Show status
    echo -e "${GREEN}📊 Deployment Status:${NC}"
    kubectl get pods -n ${namespace}
    kubectl get services -n ${namespace}
    
    echo ""
    echo -e "${GREEN}🎉 ${type} deployment completed!${NC}"
    
    if [ "$type" = "local" ]; then
        echo -e "${YELLOW}Access URLs:${NC}"
        echo -e "- Frontend: http://localhost:30000"
        echo -e "- Backend: http://localhost:30001/api"
    else
        echo -e "${YELLOW}Access URLs:${NC}"
        echo -e "- Frontend: http://27.254.134.143:30000"
        echo -e "- Backend: http://27.254.134.143:30001/api"
    fi
    echo ""
}

# Main deployment logic
case $DEPLOYMENT_TYPE in
    "local")
        echo -e "${BLUE}Deploying for Local Development${NC}"
        deploy_pokedex "local" "pokedex-local" "k8s/deploy-pokedex-local.yaml"
        ;;
    "server")
        echo -e "${BLUE}Deploying for Server (27.254.134.143)${NC}"
        deploy_pokedex "server" "pokedex" "k8s/deploy-pokedex-complete.yaml"
        ;;
    "both")
        echo -e "${BLUE}Deploying Both Local and Server${NC}"
        deploy_pokedex "local" "pokedex-local" "k8s/deploy-pokedex-local.yaml"
        sleep 5
        deploy_pokedex "server" "pokedex" "k8s/deploy-pokedex-complete.yaml"
        ;;
    *)
        echo -e "${RED}❌ Invalid deployment type: ${DEPLOYMENT_TYPE}${NC}"
        echo -e "${YELLOW}Usage:${NC}"
        echo -e "  $0 [local|server|both]"
        echo -e ""
        echo -e "${YELLOW}Examples:${NC}"
        echo -e "  $0 local    # Deploy for local development"
        echo -e "  $0 server   # Deploy for server (27.254.134.143)"
        echo -e "  $0 both     # Deploy both configurations"
        exit 1
        ;;
esac
