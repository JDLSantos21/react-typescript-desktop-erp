import { useQuery } from "@tanstack/react-query";
import { EmployeeService } from "../api/employee.service";

export const useGetAllDrivers = () => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: () => EmployeeService.getAllDrivers(),
  });
};
