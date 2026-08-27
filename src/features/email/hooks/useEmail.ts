import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmailService } from "../api/email.service";

const emailKeys = {
  all: ["email"] as const,
  settings: () => [...emailKeys.all, "settings"] as const,
  defaults: () => [...emailKeys.settings(), "order-defaults"] as const,
  customerPreferences: (customerId: string) =>
    [...emailKeys.all, "customers", customerId, "preferences"] as const,
  customerMessages: (customerId: string) =>
    [...emailKeys.all, "customers", customerId, "messages"] as const,
  orderMessages: (orderId: number) =>
    [...emailKeys.all, "orders", orderId, "messages"] as const,
};

export const useOrderEmailDefaults = () =>
  useQuery({ queryKey: emailKeys.defaults(), queryFn: EmailService.getOrderDefaults });

export const useEmailSettings = () =>
  useQuery({ queryKey: emailKeys.settings(), queryFn: EmailService.getSettings });

export const useUpdateEmailSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: EmailService.updateSettings,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: emailKeys.settings() });
      void queryClient.invalidateQueries({ queryKey: emailKeys.defaults() });
    },
  });
};

export const useCustomerEmailPreferences = (customerId: string) =>
  useQuery({
    queryKey: emailKeys.customerPreferences(customerId),
    queryFn: () => EmailService.getCustomerPreferences(customerId),
    enabled: Boolean(customerId),
  });

export const useUpdateCustomerEmailPreferences = (customerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (receivesOrderEmails: boolean) =>
      EmailService.updateCustomerPreferences(customerId, receivesOrderEmails),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: emailKeys.customerPreferences(customerId),
      });
      void queryClient.invalidateQueries({ queryKey: ["customers", "detail", customerId] });
    },
  });
};

export const useResetCustomerEmailUnsubscribe = (customerId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => EmailService.resetCustomerUnsubscribe(customerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: emailKeys.customerPreferences(customerId),
      });
      void queryClient.invalidateQueries({ queryKey: ["customers", "detail", customerId] });
    },
  });
};

export const useCustomerEmailMessages = (customerId: string) =>
  useQuery({
    queryKey: emailKeys.customerMessages(customerId),
    queryFn: () => EmailService.getCustomerMessages(customerId),
    enabled: Boolean(customerId),
  });

export const useOrderEmailMessages = (orderId: number) =>
  useQuery({
    queryKey: emailKeys.orderMessages(orderId),
    queryFn: () => EmailService.getOrderMessages(orderId),
    enabled: Boolean(orderId),
  });

export const useResendOrderEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: EmailService.resendOrderEmail,
    onSuccess: (_, orderId) => {
      void queryClient.invalidateQueries({ queryKey: emailKeys.orderMessages(orderId) });
    },
  });
};
